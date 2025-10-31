import prisma from "@/lib/prisma";
import { comparePassword } from "@/lib/hash";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "supersecretkey";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return Response.json({ error: "User tidak ditemukan" }, { status: 404 });
    }

    const valid = await comparePassword(password, user.password);
    if (!valid) {
      return Response.json({ error: "Password salah" }, { status: 401 });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      SECRET_KEY,
      { expiresIn: "7d" }
    );

    const cookieHeader = `token=${token}; Path=/; HttpOnly; Max-Age=${7 * 24 * 60 * 60}; SameSite=Lax${
      process.env.NODE_ENV === "production" ? "; Secure" : ""
    }`;

    return Response.json(
      { message: "Login berhasil" },
      {
        status: 200,
        headers: {
          "Set-Cookie": cookieHeader,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err) {
    return Response.json({ error: "Server Error" }, { status: 500 });
  }
}
