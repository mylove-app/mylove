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
    const { name, subdomain, templateId, content, userId , priceIndex} = body;

    if (!name) {
      return Response.json(
        { error: "Missing required name" },
        { status: 400 }
      );
    }
    if (!subdomain) {
      return Response.json(
        { error: "Missing required subdomain" },
        { status: 400 }
      );
    }
    if (!templateId) {
      return Response.json(
        { error: "Missing required templateId" },
        { status: 400 }
      );
    }
    if (!userId) {
      return Response.json(
        { error: "Missing userId" },
        { status: 400 }
      );
    }

    const newSite = await prisma.site.create({
      data: {
        name,
        subdomain,
        templateId: Number(templateId),
        content,
        userId: Number(userId),
        expiredAt: null,
        status: false,
        priceIndex
      },
    });

    return Response.json(newSite, { status: 201 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
