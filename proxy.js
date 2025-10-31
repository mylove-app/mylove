import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "supersecretkey";
const protectedRoutes = ["/dashboard", "/profile", "/api/protected"];

// Domain utama proyek kamu
const ROOT_DOMAINS = [
  "localhost",             // untuk lokal dev
  "mylove.my.id",          // domain produksi utama
  "mylove-sable.vercel.app" // domain vercel
];

export async function proxy(req) {
  const url = req.nextUrl.clone();
  const { pathname } = req.nextUrl;
  const host = req.headers.get("host") || "";

  // Hapus port dari host (misal: "localhost:3000" -> "localhost")
  const domain = host.split(":")[0];
  const parts = domain.split(".");

  // Cek apakah domain utama
  const isRootDomain = ROOT_DOMAINS.some((root) => domain === root);

  // Cek apakah domain lokal dengan subdomain (contoh: tokomawar.localhost)
  const isLocalSubdomain =
    domain.endsWith(".localhost") && domain.split(".").length > 1;

  // Jika domain bukan root domain (misal: tokomawar.mylove.my.id)
  // atau localhost dengan subdomain, rewrite ke /site/[subdomain]
  if (!isRootDomain && (isLocalSubdomain || parts.length > 2)) {
    const subdomain = parts[0];
    url.pathname = `/site/${subdomain}`;
    return NextResponse.rewrite(url);
  }

  // Middleware untuk route yang dilindungi
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
