export const runtime = "nodejs";

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request) {
  try {
    const data = await request.json();

    const {
      order_id,
      transaction_status,
      fraud_status,
    } = data;

    const isSuccess =
      (transaction_status === "capture" && fraud_status === "accept") ||
      transaction_status === "settlement";

    if (!isSuccess) return NextResponse.json({ message: "OK" });

    const siteId = Number(order_id.split("-")[1]);
    if (!siteId) {
      return NextResponse.json({ error: "Invalid order_id" }, { status: 400 });
    }

    await prisma.site.update({
      where: { id: siteId },
      data: { status: true },
    });

    return NextResponse.json({ message: "OK" });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to process callback" },
      { status: 500 }
    );
  }
}
