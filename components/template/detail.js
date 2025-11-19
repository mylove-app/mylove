"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import TemplateCard from "@/components/template/card";
import Title from "@/components/reusable/title";
import NotFound from "@/app/not-found";

export default function TemplateDetail() {
  const { id } = useParams();
  const router = useRouter();

  const [template, setTemplate] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const res = await fetch(`/api/template/${id}`);
        if (!res.ok) {
          setTemplate(null);
          return;
        }
        const data = await res.json();
        setTemplate(data);

        // Fetch related templates
        if (data?.category?.length) {
          const category = encodeURIComponent(data.category[0]); // ambil kategori pertama
          const relatedRes = await fetch(
            `/api/template/kategori/${category}?limit=8`
          );
          const relatedData = await relatedRes.json();
          // Filter template yang sama agar tidak muncul lagi
          setRelated(relatedData.filter((t) => t.id !== data.id));
        }
      } catch (error) {
        console.error(error);
        setTemplate(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchTemplate();
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto p-6 pt-4 max-w-7xl animate-pulse">
        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Skeleton Gambar */}
          <div className="space-y-4">
            <div className="w-full h-[240px] sm:h-[300px] md:h-[350px] bg-gray-200 rounded-xl"></div>
            <div className="flex gap-3 overflow-x-auto">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="w-20 h-20 bg-gray-200 rounded-xl flex-shrink-0"
                ></div>
              ))}
            </div>
          </div>

          {/* Skeleton Detail */}
          <div className="flex flex-col justify-between h-full min-h-[350px]">
            <div className="space-y-4">
              {/* Nama Template */}
              <div className="w-3/4 h-8 bg-gray-200 rounded"></div>

              {/* Kategori */}
              <div className="flex gap-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-16 h-6 bg-gray-200 rounded-full"
                  ></div>
                ))}
              </div>

              {/* Deskripsi */}
              <div className="space-y-2">
                <div className="w-full h-4 bg-gray-200 rounded"></div>
                <div className="w-5/6 h-4 bg-gray-200 rounded"></div>
                <div className="w-2/3 h-4 bg-gray-200 rounded"></div>
              </div>
            </div>

            {/* Tombol Aksi */}
            <div className="flex gap-8 mt-auto">
              <div className="w-full md:w-1/2 h-10 bg-gray-200 rounded-xl"></div>
              <div className="w-full md:w-1/2 h-10 bg-gray-200 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!template || Object.keys(template).length === 0) {
    return (
      <NotFound
        title="Template Tidak Ditemukan!"
        code="404"
        message="Oops! Template yang anda cari tidak ditemukan."
        buttonLabel="Kembali"
        buttonHref="/"
      />
    );
  }

  const images = template.image?.slice(0, 5) || [];

  return (
    <div className="mx-auto p-6 pt-4 max-w-7xl">
      {/* Detail Template */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div>
          <div className="relative w-full h-[240px] sm:h-[300px] md:h-[350px] bg-gray-100 rounded-xl overflow-hidden">
            {images[activeImage] ? (
              <Image
                src={images[activeImage]}
                alt={`Gambar ${activeImage + 1}`}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-all duration-500 ease-in-out"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                <Image
                  src="/no-image.png"
                  alt="No Image"
                  width={200}
                  height={200}
                  className="object-contain"
                />
              </div>
            )}
          </div>

          <div className="flex gap-3 mt-3 overflow-x-auto">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={`relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all duration-200 ${
                  i === activeImage
                    ? "border-primary scale-90"
                    : "border-transparent hover:border-gray-300"
                }`}
              >
                <Image
                  src={img}
                  alt={`Thumb ${i + 1}`}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </button>
            ))}

            {template.image?.length > 5 && (
              <div className="w-20 h-20 flex items-center justify-center rounded-xl bg-gray-100 text-gray-600 text-sm">
                +{template.image.length - 5} lagi
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col justify-between h-full min-h-[350px]">
          <div>
            <h1 className="text-4xl font-semibold mb-4 text-gray-900 break-words">
              {template.name}
            </h1>

            <div className="flex flex-wrap gap-2 mb-3">
              {template.category?.map((cat, i) => (
                <span
                  key={i}
                  className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                >
                  {cat}
                </span>
              ))}
            </div>

            <p className="text-gray-600 mb-6 break-words">
              {template.description || "Tidak ada deskripsi."}
            </p>
          </div>

          <div className="flex gap-8 mt-auto">
            <button
              onClick={() => router.push(`/template/${id}/add`)}
              className="w-full md:w-1/2 bg-primary text-white py-3 rounded-xl font-medium hover:bg-primary/80 transition"
            >
              Gunakan Template
            </button>

            <button className="w-full md:w-1/2 bg-primary text-white py-3 rounded-xl font-medium hover:bg-primary/80 transition">
              Lihat Preview
            </button>
          </div>
        </div>
      </div>

      {/* Related Templates */}
      {related.length > 0 && (
        <div className="mt-12">
          <Title>Template Terkait</Title>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {related.map((t) => (
              <TemplateCard key={t.id} template={t} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
