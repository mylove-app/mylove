export const runtime = "nodejs";

import { NextResponse } from "next/server";

const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY;

export async function POST(request) {
    try {
        const data = await request.json();
        console.log("Midtrans callback payload:", data);

        /**
         * Contoh payload Midtrans:
         * {
         *   transaction_status: "capture",
         *   payment_type: "bca_va",
         *   order_id: "site-9-1763605363740",
         *   gross_amount: "15000",
         *   fraud_status: "accept",
         *   va_numbers: [{ bank: "bca", va_number: "8888999911112222" }]
         * }
         */

        const { order_id, transaction_status, fraud_status, payment_type } = data;

        // Lakukan logika update database sesuai order_id
        // Misal: set status 'paid', 'pending', atau 'failed'
        // Contoh pseudocode:
        // await db.template.update({
        //   where: { order_id },
        //   data: { status: transaction_status }
        // });

        console.log(
            `Order ${order_id} | Status: ${transaction_status} | Payment: ${payment_type}`
        );

        // Kirim response 200 ke Midtrans
        return NextResponse.json({ message: "OK" });
    } catch (err) {
        console.error("Midtrans callback error:", err);
        return NextResponse.json({ error: "Failed to process callback" }, { status: 500 });
    }
}
