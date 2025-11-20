import { NextResponse } from "next/server";
import Midtrans from "midtrans-client";
import prisma from "@/lib/prisma";

const core = new Midtrans.CoreApi({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === "true",
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY
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
    const notif = await core.transaction.notification(body);

    const orderId = notif.order_id; // "site-12-1732928829"
    const transactionStatus = notif.transaction_status;

    const siteId = Number(orderId.split("-")[1]);

    // Ambil priceIndex agar tahu durasi expired
    const site = await prisma.site.findUnique({
      where: { id: siteId },
    });

    if (!site) {
      return NextResponse.json({ error: "Site not found" }, { status: 404 });
    }

    if (transactionStatus === "capture" || transactionStatus === "settlement") {
      const expiredAt = calculateExpired(site.priceIndex);

      await prisma.site.update({
        where: { id: siteId },
        data: {
          status: true,
          expiredAt: expiredAt,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
