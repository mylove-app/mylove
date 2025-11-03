import prisma from "@/lib/prisma";
import { hashPassword } from "@/lib/hash";

export async function POST(req) {
  try {
    const { name, email, password, role } = await req.json();

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return Response.json({ error: "Email sudah terdaftar" }, { status: 400 });
    }

    const hashed = await hashPassword(password);

    const user = await prisma.user.create({
      data: { name, email, password: hashed,role },
    });

    return Response.json({ message: "Registrasi berhasil" }, { status: 201 });
  } catch {
    return Response.json({ error: "Server Error" }, { status: 500 });
  }
}
