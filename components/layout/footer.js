import Link from "next/link";

export default function Footer() {
  const menus = [
    { name: "Beranda", path: "/#beranda" },
    { name: "template", path: "/#template"},
    { name: "Kategori", path: "/kategori"},
  ];

  return (
    <footer className="bg-background border-t-2 border-primary text-foreground py-10">
      <div className="max-w-6xl mx-auto px-4 text-center flex flex-col items-center">
        <h2 className="text-2xl font-bold text-foreground mb-6">
          myLove<span className="text-primary">.</span>
        </h2>

        <ul className="flex flex-wrap justify-center gap-6 text-sm mb-6">
          {menus.map((menu) => (
            <li key={menu.name}>
              <Link href={menu.path} className="hover:text-primary transition">
                {menu.name}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex gap-6 justify-center mb-6">
          <Link
            href="#"
            aria-label="TikTok"
            className="hover:text-primary transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
              className="w-6 h-6"
            >
              <path d="M16.75 2c.1 1.26.66 2.46 1.57 3.37a6.15 6.15 0 0 0 3.34 1.75v3.4a9.51 9.51 0 0 1-4.93-1.42v6.94a7.57 7.57 0 1 1-7.56-7.57c.34 0 .68.03 1.01.08v3.59a4.04 4.04 0 1 0 3.02 3.9V2h3.55Z" />
            </svg>
          </Link>

          <Link
            href="#"
            aria-label="Instagram"
            className="hover:text-primary transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
              className="w-6 h-6"
            >
              <path d="M7 2C4.2 2 2 4.2 2 7v10c0 2.8 2.2 5 5 5h10c2.8 0 5-2.2 5-5V7c0-2.8-2.2-5-5-5H7zm10 2c1.7 0 3 1.3 3 3v10c0 1.7-1.3 3-3 3H7c-1.7 0-3-1.3-3-3V7c0-1.7 1.3-3 3-3h10zm-5 3.5a5.5 5.5 0 1 0 .001 11.001A5.5 5.5 0 0 0 12 7.5zm0 2a3.5 3.5 0 1 1-.001 7.001A3.5 3.5 0 0 1 12 9.5zm4.75-3.75a.75.75 0 1 0 0 1.5h.01a.75.75 0 1 0 0-1.5h-.01z" />
            </svg>
          </Link>

          <Link
            href="#"
            aria-label="WhatsApp"
            className="hover:text-primary transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
              className="w-6 h-6"
            >
              <path d="M12 2a9.9 9.9 0 0 0-8.44 15.22L2 22l4.95-1.52A9.9 9.9 0 1 0 12 2Zm0 18a8 8 0 0 1-4.1-1.13l-.29-.17-2.93.9.9-2.84-.18-.3A7.97 7.97 0 1 1 12 20Zm4.48-5.42c-.25-.12-1.47-.73-1.7-.82-.23-.08-.4-.12-.57.12-.17.25-.65.82-.8.99-.15.17-.3.19-.55.07-.25-.12-1.06-.39-2.01-1.24a7.57 7.57 0 0 1-1.39-1.73c-.15-.25 0-.38.12-.5.12-.12.25-.3.37-.45.12-.15.17-.25.25-.42.08-.17.04-.32-.02-.45-.06-.12-.57-1.37-.78-1.87-.2-.48-.4-.42-.57-.43h-.49c-.17 0-.45.06-.69.32-.25.25-.9.88-.9 2.13 0 1.25.92 2.46 1.05 2.63.13.17 1.82 2.77 4.4 3.89 2.6 1.13 2.6.75 3.07.7.47-.04 1.48-.6 1.7-1.18.22-.58.22-1.07.15-1.18-.07-.11-.23-.17-.48-.29Z" />
            </svg>
          </Link>
        </div>

        <div className="border-t border-gray-800 pt-5 text-xs text-gray-500 w-full">
          © {new Date().getFullYear()} myLove. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
