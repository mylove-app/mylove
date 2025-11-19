import prisma from "@/lib/prisma";

export async function GET(_, { params }) {
  try {
    const { userId } = await params;

    const sites = await prisma.site.findMany({
      where: { userId: Number(userId) },
      include: { user: true },
      orderBy: { id: "desc" },
    });

    if (!sites || sites.length === 0) {
      return Response.json(
        { message: "No sites found for this user" },
        { status: 404 }
      );
    }

    return Response.json(sites, { status: 200 });
  } catch (error) {
    console.error("Error fetching sites by user:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
