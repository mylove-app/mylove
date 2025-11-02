import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const sites = await prisma.site.findMany({
      include: { user: true },
      orderBy: { id: "desc" },
    });

    return Response.json(sites, { status: 200 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, subdomain, template, content, userId, expiredAt } = body;

    if (!name || !subdomain || !template || !userId) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newSite = await prisma.site.create({
      data: {
        name,
        subdomain,
        template,
        content,
        userId,
        expiredAt: expiredAt ? new Date(expiredAt) : null,
      },
    });

    return Response.json(newSite, { status: 201 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
