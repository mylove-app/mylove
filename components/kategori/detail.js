"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import TemplateCard from "@/components/template/card";
import { Search } from "lucide-react";

export default function KategoriDetail() {
  const { kategori } = useParams();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const limit = 20;

  const fetchTemplates = async (pageNum = 1) => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/template/kategori/${encodeURIComponent(
          kategori
        )}?page=${pageNum}&limit=${limit}`,
        { cache: "no-store" }
      );
      const data = await res.json();

      if (data.length < limit) setHasMore(false);
      else setHasMore(true);

      setTemplates((prev) => (pageNum === 1 ? data : [...prev, ...data]));
    } catch (error) {
      console.error("Gagal memuat template:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!kategori) return;
    setPage(1);
    fetchTemplates(1);
  }, [kategori]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchTemplates(nextPage);
  };

  const filteredTemplates = templates.filter((template) => {
    const lowerSearch = search.toLowerCase();
    return (
      template.name.toLowerCase().includes(lowerSearch) ||
      (template.description &&
        template.description.toLowerCase().includes(lowerSearch))
    );
  });

  return (
    <main className="max-w-full mx-auto">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6 capitalize">
          {decodeURIComponent(kategori)}
        </h1>

        <div className="relative w-full md:w-1/3">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Cari template..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-300 rounded-full pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {loading && templates.length === 0 ? (
          <p>Memuat template...</p>
        ) : filteredTemplates.length === 0 ? (
          <p className="text-gray-500">Tidak ada template yang cocok.</p>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
              {filteredTemplates.map((template) => (
                <TemplateCard key={template.id} template={template} />
              ))}
            </div>

            {hasMore && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={handleLoadMore}
                  disabled={loading}
                  className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/80 transition disabled:bg-gray-200 disabled:text-gray-500"
                >
                  {loading ? "Memuat..." : "Lihat Selengkapnya"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
