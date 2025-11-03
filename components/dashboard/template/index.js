"use client";

import { ChevronDown, Search } from "lucide-react";
import TemplateCard from "./card";
import { useState, useEffect } from "react";

function SkeletonCard() {
  return (
    <div className="animate-pulse flex flex-col border border-gray-200 rounded-[8px] p-3">
      <div className="aspect-[4/3] bg-gray-200 rounded-md mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-3 bg-gray-200 rounded w-5/6 mb-1"></div>
      <div className="h-3 bg-gray-200 rounded w-2/3 mb-3"></div>
      <div className="flex justify-end mt-auto">
        <div className="h-6 w-20 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
}

export default function Template() {
  const [templates, setTemplates] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [visibleCount, setVisibleCount] = useState(20);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true);

  async function fetchTemplates(pageNum = 1) {
    try {
      setLoading(true);
      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_BASE_API || ""
        }/api/template?page=${pageNum}&limit=20`,
        { cache: "no-store" }
      );
      const data = await res.json();

      if (Array.isArray(data) && data.length > 0) {
        setTemplates((prev) => [...prev, ...data]);
        setHasMoreData(data.length === 20);
      } else {
        setHasMoreData(false);
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTemplates(1);
  }, []);

  const categories = [
    "Semua",
    ...new Set(templates.flatMap((t) => t.category || []).filter(Boolean)),
  ];

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch = template.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === "Semua" ||
      (template.category || []).includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  const visibleTemplates = filteredTemplates.slice(0, visibleCount);
  const hasMoreVisible = visibleCount < filteredTemplates.length;

  const handleLoadMore = () => {
    if (hasMoreVisible) {
      setVisibleCount((prev) => prev + 20);
    } else if (hasMoreData && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchTemplates(nextPage);
    }
  };

  return (
    <main className="p-6" id="template">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-3">
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
        <div className="relative w-full overflow-x-auto scrollbar-hide">
          <div className="flex items-center gap-2 min-w-max pb-2 md:justify-end scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setVisibleCount(20);
                }}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  selectedCategory === cat
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-primary/10"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading && templates.length === 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : filteredTemplates.length === 0 ? (
        <p className="text-gray-500">Tidak ada template ditemukan.</p>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {visibleTemplates.map((template) => (
              <TemplateCard key={template.id} template={template} />
            ))}

            {loading &&
              Array.from({ length: 4 }).map((_, i) => (
                <SkeletonCard key={`s-${i}`} />
              ))}
          </div>

          {(hasMoreVisible || hasMoreData) && (
            <div className="flex justify-center mt-6">
              <button
                onClick={handleLoadMore}
                disabled={loading}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border rounded-lg transition-all ${
                  loading
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "text-primary border-primary hover:bg-primary hover:text-white"
                }`}
              >
                {loading ? "Memuat..." : "Tampilkan Lebih Banyak"}
                {!loading && <ChevronDown size={16} />}
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
}
