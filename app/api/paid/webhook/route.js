import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";

export async function POST(request) {
  try {
    const body = await request.json();

    const {
      order_id,
      transaction_status,
      fraud_status,
      signature_key
    } = body;

    // Validate Midtrans signature
    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    const raw = body.order_id + body.status_code + body.gross_amount + serverKey;
    const expectedSignature = crypto
      .createHash("sha512")
      .update(raw)
      .digest("hex");

    if (signature_key !== expectedSignature) {
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 401 }
      );
    }

    // Ambil ID site dari order_id
    // Format order_id sebelumnya: "ORDER-" + Date.now()
    // Untuk lebih cocok, kita anggap order_id memakai ID site
    // Tetapi karena sistemmu tidak memakai ID dalam order_id,
    // kita tidak bisa ambil id site dari order_id
    // → Jadi kita simpan mapping di tabel site: expiredAt sudah diupdate oleh /paid
    // → Maka kita update semua site yang punya order_id ini
    // Namun tanpa model order, kita harus ambil site by expiredAt update time (kurang akurat)
    // Jadi kita UBAH order_id menjadi: "SITE-" + siteId + "-" + Date.now()
    // --- agar bisa dibaca webhook

    const parts = order_id.split("-");
    const siteId = Number(parts[1]);

    if (!siteId) {
      return NextResponse.json(
        { error: "Invalid order_id format. Expected: SITE-{id}-{timestamp}" },
        { status: 400 }
      );
    }

    let newStatus = false;

    if (transaction_status === "capture") {
      if (fraud_status === "accept") newStatus = true;
    } else if (transaction_status === "settlement") {
      newStatus = true;
    } else if (
      transaction_status === "cancel" ||
      transaction_status === "deny" ||
      transaction_status === "expire"
    ) {
      newStatus = false;
    }

    // Update Site berdasarkan ID
    await prisma.site.update({
      where: { id: siteId },
      data: {
        status: newStatus
      }
    });

    return NextResponse.json({ message: "Webhook processed" });
  } catch (error) {
    console.error("Webhook ERROR:", error);
    return NextResponse.json(
      { error: "Internal error", detail: error.message },
      { status: 500 }
    );
  }
}
