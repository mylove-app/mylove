"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Home, Heart, Package, Settings, Menu, X, Tag } from "lucide-react";
import variable from "@/lib/variable";

export default function Navbar({ mode = "default" }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(variable.getMe);
        if (!res.ok) return;
        const data = await res.json();
        setUser(data.user);
      } catch {}
    };
    fetchUser();
  }, []);

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
  const handleLogout = async () => {
    try {
      await fetch(variable.logout, { method: "POST" });
      window.location.href = "/auth";
    } catch {}
  };
  return (
    <>
      <header
        className={`sticky top-5 z-40 mx-auto transition-all duration-500 ease-in-out py-2 md:py-4 px-2 ${
          scrolled
            ? "max-w-[90%] md:max-w-5xl bg-background/80 backdrop-blur-md rounded-4xl shadow-md"
            : "max-w-[95%] bg-none border-none rounded-none mt-0 shadow-none"
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
              scrolled ? "text-primary/90 text-xl" : "text-black text-2xl"
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
                  {item.icon}
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          {user ? (
            <div className="relative ml-4 hidden md:block">
              <button
                className="flex items-center gap-2 bg-white border border-slate-200 rounded-full px-4 py-1 hover:shadow transition-shadow"
                onClick={() => setDropdownOpen((prev) => !prev)}
              >
                <div className="w-8 h-8 rounded-full bg-primary text-background flex items-center justify-center font-semibold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-slate-800">
                  {user.name}
                </span>
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-white border border-slate-200 rounded shadow-md z-50">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="ml-4 hidden md:block">
              <a
                href="/auth"
                className="px-4 py-2 text-sm font-semibold bg-primary text-background rounded hover:bg-primary/90"
              >
                Login
              </a>
            </div>
          )}

          {/* 🔹 Tombol Menu Mobile */}
          <button onClick={openSidebar} className="md:hidden p-2">
            <Menu size={22} />
          </button>
        </div>
      </header>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          onClick={handleCloseSidebar}
        >
          <div
            className={`absolute top-0 right-0 h-full w-72 bg-white shadow-2xl rounded-l-2xl p-6 flex flex-col justify-between transform transition-transform duration-300 ease-in-out ${
              sidebarVisible ? "translate-x-0" : "translate-x-full"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div>
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

            {user ? (
              <div className="mt-6 flex flex-col items-center gap-2 border-primary border p-4 w-full bg-background rounded-lg">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-primary text-background flex items-center justify-center font-semibold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-sm font-bold text-slate-800">
                    {user.name}
                  </div>
                  <div className="text-xs text-slate-600">{user.email}</div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-center px-4 py-2 text-sm text-background bg-primary rounded-lg"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="mt-6 flex justify-center">
                <a
                  href="/auth"
                  className="w-full flex justify-center item-center py-2 text-sm font-semibold bg-primary text-background rounded-lg hover:bg-primary/90"
                >
                  Login
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
