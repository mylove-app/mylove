import prisma from "@/lib/prisma";

export async function GET(_, { params }) {
  try {
    const { id } = await params;

    const site = await prisma.site.findUnique({
      where: { id: Number(id) },
      include: { user: true },
    });

    if (!site) {
      return Response.json({ error: "Site not found" }, { status: 404 });
    }

    return Response.json(site, { status: 200 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { name, subdomain, template, content, expiredAt } = body;

    const updatedSite = await prisma.site.update({
      where: { id: Number(id) },
      data: {
        name,
        subdomain,
        template,
        content,
        expiredAt: expiredAt ? new Date(expiredAt) : null,
      },
    });

    return Response.json(updatedSite, { status: 200 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(_, { params }) {
  try {
    const { id } = await params;

    await prisma.site.delete({
      where: { id: Number(id) },
    });

    return Response.json({ message: "Site deleted successfully" }, { status: 200 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
