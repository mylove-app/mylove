export const runtime = "nodejs";

import Midtrans from "midtrans-client";
import { NextResponse } from "next/server";

const productionOnly= process.env.MIDTRANS_IS_PRODUCTION === 'true';
const snap = new Midtrans.Snap({
  isProduction: true,
  serverKey: process.env.MIDTRANS_SERVER_KEY, // HARUS VT-server-...
  clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY // HARUS VT-client-...
});

export async function POST(request) {
  try {
    const body = await request.json();
    const { id, template, price, customer } = body;

    const parameter = {
      transaction_details: {
        order_id: `site-${id}-${Date.now()}`,
        gross_amount: Number(price),
      },
      item_details: [
        {
          id: `site-${id}`,
          price: Number(price),
          quantity: 1,
          name: template,
        },
      ],
      customer_details: customer
        ? {
            first_name: customer.name || undefined,
            email: customer.email || undefined,
            phone: customer.phone || "",
          }
        : undefined,

      enabled_payments: [
        "bca_va",
        "bni_va",
        "permata_va",
        "mandiri_va",
        "qris",
        "gopay"
      ],

      callbacks: {
        finish: "https://mylove.my.id/api/template/paid/callback",
      },
    };

    const token = await snap.createTransactionToken(parameter);

    return NextResponse.json({ token });

  } catch (err) {
    return NextResponse.json(
      {
        error: "Failed to create transaction token",
        details: err?.apiResponse || err?.message || err
      },
      { status: 500 }
    );
  }
}
