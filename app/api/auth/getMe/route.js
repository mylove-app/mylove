import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "supersecretkey";

export async function GET(req) {
  try {
    const cookieHeader = req.headers.get("cookie") || "";
    const match = cookieHeader.match(/token=([^;]+)/);

    if (!match) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = match[1];
    let decoded;

    try {
      decoded = jwt.verify(token, SECRET_KEY);
    } catch {
      return Response.json({ error: "Token invalid atau kadaluarsa" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, name: true, email: true },
    });

    if (!user) {
      return Response.json({ error: "User tidak ditemukan" }, { status: 404 });
    }

    return Response.json({ user }, { status: 200 });
  } catch (err) {
    return Response.json({ error: "Server Error" }, { status: 500 });
  }
}
