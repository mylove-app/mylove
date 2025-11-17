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
    const body = await req.json();

    const {
      name,
      description,
      category,
      price,
      image,
      html,
      css,
      js
    } = body;

    const template = await prisma.template.create({
      data: {
        name,
        description,
        category,
        price,
        image,
        html,
        css,
        js
      }
    });

    return Response.json(template);
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
