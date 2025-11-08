import prisma from "@/lib/prisma";

export async function GET(req, { params }) {
  try {
    const { subdomain } = await params;

    const site = await prisma.site.findUnique({
      where: { subdomain },
      include: { user: true },
    });

    if (!site) {
      return Response.json(
        { message: "No site found for this subdomain" },
        { status: 404 }
      );
    }

    return Response.json(site, { status: 200 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
