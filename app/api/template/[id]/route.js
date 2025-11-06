import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const template = await prisma.template.findUnique({
      where: { id: parseInt(id) },
    });

    if (!template)
      return NextResponse.json({ error: "Template not found" }, { status: 404 });

    return NextResponse.json(template);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const { name, texts, images, description, image, category, price } =
      await req.json();

    const template = await prisma.template.update({
      where: { id: parseInt(id) },
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

    return NextResponse.json(template);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;

    await prisma.template.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ message: "Template deleted successfully" });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
