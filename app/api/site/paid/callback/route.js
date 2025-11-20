import { NextResponse } from "next/server";
import Midtrans from "midtrans-client";
import prisma from "@/lib/prisma";

const core = new Midtrans.CoreApi({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === "true",
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY,
});

function calculateExpired(priceIndex) {
  const now = new Date();
  if (priceIndex === 0) now.setDate(now.getDate() + 3);
  if (priceIndex === 1) now.setDate(now.getDate() + 15);
  if (priceIndex === 2) now.setDate(now.getDate() + 30);
  return now;
}

export async function POST(request) {
  try {
    const body = await request.json();
    let notif = body;

    // Jika request asli dari Midtrans, notif.status_message akan ada
    if (body.status_message === undefined) {
      // berarti manual test → skip fetch ke Midtrans API
      notif = body;
    } else {
      // request asli Midtrans
      notif = await core.transaction.notification(body);
    }

    const { order_id, transaction_status, fraud_status } = notif;

    const siteId = Number(order_id.split("-")[1]);

    if (Number.isNaN(siteId)) {
      return NextResponse.json(
        { error: "Order ID format invalid, cannot extract siteId" },
        { status: 400 }
      );
    }

    const site = await prisma.site.findUnique({
      where: { id: siteId },
    });

    if (!site) {
      return NextResponse.json({ error: "Site not found" }, { status: 404 });
    }

    const isSuccess =
      transaction_status === "settlement" ||
      (transaction_status === "capture" && fraud_status === "accept");

    if (isSuccess) {
      const expiredAt = calculateExpired(site.priceIndex);

      const updatedSite = await prisma.site.update({
        where: { id: siteId },
        data: {
          status: true,
          expiredAt,
        },
      });
      return NextResponse.json({
        success: true,
        message: "Payment processed",
        site: updatedSite,
      });
    }
  } catch (err) {
    return NextResponse.json(
      { error: err.message || "Unknown error" },
      { status: 500 }
    );
  }
}
