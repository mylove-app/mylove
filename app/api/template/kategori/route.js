import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const templates = await prisma.template.findMany({
      select: { category: true },
    });

    const allCategories = templates.flatMap((item) => item.category || []);
    const uniqueCategories = [...new Set(allCategories)];

    return NextResponse.json(uniqueCategories);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
