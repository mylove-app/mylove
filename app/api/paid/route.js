import midtransClient from "midtrans-client";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request) {
  try {
    const { id, template, price } = await request.json();

    if (!id || !template || price === undefined) {
      return NextResponse.json(
        { error: "Missing required data" },
        { status: 400 }
      );
    }

    // Ambil Site beserta Template
    const site = await prisma.site.findUnique({
      where: { id },
      include: { template: true }
    });

    if (!site) {
      return NextResponse.json(
        { error: "Site not found" },
        { status: 404 }
      );
    }

    // Ambil harga dari Template
    const selectedPrice = site.template.price[price];
    if (!selectedPrice) {
      return NextResponse.json(
        { error: "Invalid price index" },
        { status: 400 }
      );
    }

    // Hitung expiredAt
    let days = 0;
    if (price == 0) days = 3;
    else if (price == 1) days = 7;
    else if (price == 2) days = 30;

    const expiredAt = new Date();
    expiredAt.setDate(expiredAt.getDate() + days);

    // Inisialisasi Midtrans Snap
    const snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY,
      clientKey: process.env.MIDTRANS_CLIENT_KEY
    });

    const parameter = {
      transaction_details: {
        order_id: "ORDER-" + Date.now(),
        gross_amount: Number(selectedPrice)
      },
      customer_details: {
        first_name: site.name,
        email: site.user?.email || "customer@example.com"
      }
    };

    // Create transaction token
    const transaction = await snap.createTransaction(parameter);

    // Update Site: status false tetap, tapi set expiredAt
    await prisma.site.update({
      where: { id: site.id },
      data: {
        expiredAt: expiredAt
      }
    });

    return NextResponse.json({
      token: transaction.token,
      redirect_url: transaction.redirect_url
    });

  } catch (error) {
    console.error("MIDTRANS ERROR:", error);
    return NextResponse.json(
      { error: "Payment error", detail: error.message },
      { status: 500 }
    );
  }
}
