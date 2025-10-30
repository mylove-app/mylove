import prisma from "@/lib/prisma";

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, expiredAt } = body;

    if (!name || !expiredAt) {
      return Response.json({ error: "Name dan expiredAt wajib diisi" }, { status: 400 });
    }

    const domain = await prisma.domain.create({
      data: {
        name,
        expiredAt: new Date(expiredAt),
      },
    });

    return Response.json({ message: "Domain berhasil didaftarkan", domain });
  } catch (error) {
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


export async function GET() {
  try {
    const now = new Date();
    await prisma.domain.updateMany({
      where: {
        expiredAt: { lt: now },
        active: true,
      },
      data: { active: false },
    });
    const domains = await prisma.domain.findMany({
      orderBy: { id: "desc" },
    });

    return Response.json(domains);
  } catch (error) {
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
