"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function MyTemplates() {
  const [user, setUser] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  // Ambil data user yang sedang login
  useEffect(() => {
    const fetchUserAndTemplates = async () => {
      try {
        // 1️⃣ Ambil data user login
        const userRes = await fetch("/api/auth/getMe", { credentials: "include" });
        if (!userRes.ok) throw new Error("Gagal mendapatkan user login");
        const userData = await userRes.json();
        setUser(userData);

        // 2️⃣ Ambil template berdasarkan user.id
        const templateRes = await fetch(`/api/site/byUser/${userData.user.id}`);
        const data = await templateRes.json();

        if (templateRes.ok) {
          setTemplates(data);
        } else {
          setTemplates([]);
        }
      } catch (err) {
        console.error(err);
        setTemplates([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndTemplates();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-gray-500 text-lg">
        Memuat data template kamu...
      </div>
    );

  if (!user)
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-gray-500 text-lg">
        Harap login terlebih dahulu
      </div>
    );

  if (templates.length === 0)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-500 text-center">
        <p className="text-lg mb-3">Kamu belum memiliki template.</p>
        <Link
          href="/add-template"
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/80 transition"
        >
          Tambah Template
        </Link>
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-6 text-gray-900">
        Template Kamu
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {templates.map((template) => (
          <div
            key={template.id}
            className="border rounded-xl overflow-hidden hover:shadow-lg transition group"
          >
            <div className="relative w-full h-48 bg-gray-100">
              {template.image?.[0] ? (
                <Image
                  src={template.image[0]}
                  alt={template.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  style={{ objectFit: "cover" }}
                  className="group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <Image
                    src="/no-image.png"
                    alt="No Image"
                    width={100}
                    height={100}
                  />
                </div>
              )}
            </div>

            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-900 truncate">
                {template.name}
              </h2>

              <div className="flex flex-wrap gap-1 mt-2 mb-3">
                {template.category?.map((cat, i) => (
                  <span
                    key={i}
                    className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs"
                  >
                    {cat}
                  </span>
                ))}
              </div>

              <Link
                href={`/template/${template.id}`}
                className="block w-full text-center bg-primary text-white py-2 rounded-md hover:bg-primary/80 transition"
              >
                Lihat Detail
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
