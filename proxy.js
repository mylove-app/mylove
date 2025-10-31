import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "supersecretkey";
const protectedRoutes = ["/dashboard", "/profile", "/api/protected"];

const ROOT_DOMAINS = [
  "localhost",
  "mylove.my.id",
  "mylove-sable.vercel.app",
  "www.mylove.my.id"
];

export async function proxy(req) {
  const url = req.nextUrl.clone();
  const { pathname } = req.nextUrl;
  const host = req.headers.get("host") || "";

  const domain = host.split(":")[0];
  const parts = domain.split(".");

  const isRootDomain = ROOT_DOMAINS.some((root) => domain === root);

  const isLocalSubdomain =
    domain.endsWith(".localhost") && domain.split(".").length > 1;

  if (!isRootDomain && (isLocalSubdomain || parts.length > 2)) {
    const subdomain = parts[0];
    url.pathname = `/site/${subdomain}`;
    return NextResponse.rewrite(url);
  }

  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
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
    } catch {
      return NextResponse.json(
        { error: "Token invalid atau kadaluarsa" },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
