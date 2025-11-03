import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req, { params }) {
  const { kategori } = await params;

  if (!kategori) {
    return NextResponse.json([], { status: 400 });
  }

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page")) || 1; 
  const limit = parseInt(searchParams.get("limit")) || 20; 

  const skip = (page - 1) * limit;

  const templates = await prisma.template.findMany({
    where: {
      category: {
        has: kategori.toLowerCase(),
      },
    },
    orderBy: { id: "desc" },
    skip,
    take: limit,
  });

  return NextResponse.json(templates);
}
