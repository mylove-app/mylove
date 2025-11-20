export const runtime = "nodejs";

import Midtrans from "midtrans-client";
import { NextResponse } from "next/server";

const serverKey = process.env.MIDTRANS_SERVER_KEY;
if (!serverKey) console.error("MIDTRANS_SERVER_KEY is not defined in environment");

// allow toggling production mode via env var MIDTRANS_IS_PRODUCTION (string 'true')
const isProduction = process.env.MIDTRANS_IS_PRODUCTION === "true";
let snap = new Midtrans.Snap({
    isProduction,
    serverKey,
});

export async function POST(request) {
    try {
        const { id, template, price, customer } = await request.json();

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
                  }
                : undefined,
            // Tambahkan payment methods yang diizinkan
            enabled_payments: [
                "bca_va",
                "bni_va",
                "permata_va",
                "mandiri_va",
                "qris",
                "gopay",
            ],
            // Merchant URL statis untuk callback
            callbacks: {
                finish: "https://mylove.my.id/api/template/paid/callback",
            },
        };

        console.log("Midtrans parameter:", JSON.stringify(parameter));

        const token = await snap.createTransactionToken(parameter);
        console.log("token midtrans:", token);
        return NextResponse.json({ token });
    } catch (err) {
        console.error("Midtrans createTransactionToken error:", err);
        return NextResponse.json({ error: "Failed to create transaction token" }, { status: 500 });
    }
}
