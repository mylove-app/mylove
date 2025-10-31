import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "supersecretkey";
const protectedRoutes = ["/dashboard", "/profile", "/api/protected"];

export function middleware(req) {
  const { pathname } = req.nextUrl;
  if (!protectedRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }
  const cookieHeader = req.headers.get("cookie") || "";
  const match = cookieHeader.match(/token=([^;]+)/);
  if (!match) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = match[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const response = NextResponse.next();
    response.headers.set("x-user-id", decoded.id);
    response.headers.set("x-user-email", decoded.email);
    response.headers.set("x-user-name", decoded.name);
    return response;
  } catch (err) {
    return NextResponse.json({ error: "Token invalid atau kadaluarsa" }, { status: 401 });
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/api/protected/:path*"],
};
