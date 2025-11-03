"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function KategoriPage() {
  const [categories, setCategories] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await fetch("/api/template/kategori");
      const data = await res.json();
      setCategories(data);
    };
    fetchCategories();
  }, []);

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div
            key={cat}
            onClick={() => router.push(`/kategori/${encodeURIComponent(cat)}`)}
            className="
        cursor-pointer 
        rounded-lg 
        p-6 
        text-center 
        font-semibold 
        capitalize 
        bg-primary/80 
        text-background 
        border border-transparent 
        shadow-sm 
        hover:bg-background 
        hover:text-primary 
        hover:border-primary 
        hover:shadow-md 
        transition 
        duration-300
      "
          >
            {cat}
          </div>
        ))}
      </div>
    </div>
  );
}
