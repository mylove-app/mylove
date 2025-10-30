"use client";

import { usePathname } from "next/navigation";
import Navbar from "./navbar";
import Footer from "./footer";

export default function AppShell({ children }) {
  const pathname = usePathname();
  const exactPaths = ["/", "/wishlist", "/settings"];
  const startsWithPaths = ["/template"];

  const showLayout =
    exactPaths.includes(pathname) ||
    startsWithPaths.some((path) => pathname.startsWith(path));

  return (
    <>
      {showLayout && <Navbar />}
      <main>{children}</main>
      {showLayout && <Footer />}
    </>
  );
}
