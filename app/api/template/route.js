import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page")) || 1;
  const limit = parseInt(searchParams.get("limit")) || 20;
  const skip = (page - 1) * limit;

  const templates = await prisma.template.findMany({
    skip,
    take: limit,
    orderBy: { id: "desc" },
  });

  return NextResponse.json(templates);
}

export async function POST(req) {
  try {
    const { name, texts, images, description, image, category, price } = await req.json();

    const template = await prisma.template.create({
      data: {
        name,
        texts,
        images,
        description,
        image,
        category,
        price,
      },
    });

    return NextResponse.json(template, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
