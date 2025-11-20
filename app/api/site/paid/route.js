export const runtime = "nodejs";

import Midtrans from "midtrans-client";
import { NextResponse } from "next/server";

const serverKey = process.env.MIDTRANS_SERVER_KEY;
if (!serverKey) console.error("[midtrans-route] MIDTRANS_SERVER_KEY is not defined in environment");
if (serverKey) console.log(`[midtrans-route] MIDTRANS_SERVER_KEY is set: ${serverKey}`);

// Toggle production mode via env var
const isProduction = process.env.MIDTRANS_IS_PRODUCTION === "true";
let snap = new Midtrans.Snap({ isProduction, serverKey });

export async function POST(request) {
  try {
    const body = await request.json();
    const { id, template, price, customer } = body;

    console.log("[midtrans-route] --- Incoming Request ---");
    console.log("[midtrans-route] body:", JSON.stringify(body, null, 2));
    console.log("[midtrans-route] isProduction:", isProduction);
    console.log("[midtrans-route] serverKey present:", !!serverKey);

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
      enabled_payments: ["bca_va", "bni_va", "permata_va", "mandiri_va", "qris", "gopay"],
      callbacks: {
        finish: "https://mylove.my.id/api/template/paid/callback",
      },
    };

    console.log("[midtrans-route] --- Snap Parameter ---");
    console.log(JSON.stringify(parameter, null, 2));

    const token = await snap.createTransactionToken(parameter);
    console.log("[midtrans-route] --- Token Created ---");
    console.log("token:", token);

    return NextResponse.json({ token });
  } catch (err) {
    console.error("[midtrans-route] --- createTransactionToken Error ---");
    console.error("Error object:", err);
    if (err?.httpStatus) console.error("[midtrans-route] httpStatus:", err.httpStatus);
    if (err?.apiResponse) console.error("[midtrans-route] apiResponse:", JSON.stringify(err.apiResponse, null, 2));
    if (err?.stack) console.error("[midtrans-route] stack trace:", err.stack);

    try {
      if (err?.response) console.error("[midtrans-route] response:", JSON.stringify(err.response, null, 2));
    } catch (innerErr) {
      console.error("[midtrans-route] failed to log nested error details", innerErr);
    }

    return NextResponse.json(
      { error: "Failed to create transaction token", details: err?.apiResponse || err?.message || err },
      { status: 500 }
    );
  }
}
