"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Home,
  Heart,
  Package,
  Settings,
  Menu,
  X,
  Tag,
} from "lucide-react";

export default function Navbar({ mode = "default" }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (mode === "hidden") return null;

  // 🔹 Fungsi animasi sidebar
  const openSidebar = () => {
    setSidebarOpen(true);
    setTimeout(() => setSidebarVisible(true), 10);
  };
  const handleCloseSidebar = () => {
    setSidebarVisible(false);
    setTimeout(() => setSidebarOpen(false), 300);
  };

  const menuItems = [
    { name: "Beranda", href: "/", icon: <Home size={18} /> },
    { name: "Wishlist", href: "/wishlist", icon: <Heart size={18} /> },
    { name: "Kategori", href: "/kategori", icon: <Tag size={18} /> },
    { name: "Produk", href: "/produk/kelola", icon: <Package size={18} /> },
    { name: "Settings", href: "/settings", icon: <Settings size={18} /> },
  ];

  return (
    <>
      <header
        className={`sticky top-5 z-40 mx-auto transition-all duration-500 ease-in-out py-4 px-2 ${
          scrolled
            ? "max-w-5xl bg-background/80 backdrop-blur-md rounded-4xl shadow-md"
            : "max-w-6xl bg-none border-none rounded-none mt-0 shadow-none"
        }`}
      >
        <div
          className={`px-4 flex items-center justify-between transition-all duration-500 ${
            scrolled ? "py-2" : "py-3"
          }`}
        >
          <Link
            href="/"
            className={`font-extrabold tracking-tight transition-all duration-300 ${
              scrolled ? "text-primary/90 text-lg" : "text-black text-xl"
            }`}
          >
            myLove
          </Link>

          {/* 🔹 Menu Desktop */}
          <div className="hidden md:flex items-center gap-4">
            <nav className="flex items-center gap-4 text-sm font-medium">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`inline-flex items-center gap-1 transition-colors hover:text-primary/90 ${
                    pathname === item.href
                      ? "text-primary font-semibold"
                      : "text-slate-700"
                  }`}
                >
                  {item.icon}{item.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* 🔹 Tombol Menu Mobile */}
          <button
            onClick={openSidebar}
            className="md:hidden p-2"
          >
            <Menu size={22} />
          </button>
        </div>
      </header>

      {/* 🔹 Sidebar Mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          onClick={handleCloseSidebar}
        >
          <div
            className={`absolute top-0 right-0 h-full w-72 bg-white shadow-2xl rounded-l-2xl p-6 transform transition-transform duration-300 ease-in-out ${
              sidebarVisible ? "translate-x-0" : "translate-x-full"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-primary">Menu</h2>
              <button
                onClick={handleCloseSidebar}
                className="p-2 rounded-full hover:bg-slate-100 transition-all duration-300 hover:rotate-90"
                aria-label="Close sidebar"
              >
                <X size={22} className="text-slate-600" />
              </button>
            </div>

            <nav className="flex flex-col gap-4 text-base font-medium">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-2 hover:text-primary transition-colors ${
                    pathname === item.href ? "text-primary" : "text-slate-700"
                  }`}
                  onClick={handleCloseSidebar}
                >
                  {item.icon} {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
