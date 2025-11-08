"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

export default function TemplateDetail() {
  const { id } = useParams();
  const router = useRouter();

  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedDuration, setSelectedDuration] = useState(1);

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const res = await fetch(`/api/template/${id}`);
        const data = await res.json();
        setTemplate(data);
      } catch {
        setTemplate(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchTemplate();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-gray-500 text-lg">
        Memuat...
      </div>
    );
  }

  if (!template) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-gray-500 text-lg">
        Template tidak ditemukan
      </div>
    );
  }

  const images = template.image?.slice(0, 5) || [];
  const prices = template.price || [];

  const getPriceByDuration = () => {
    if (selectedDuration === 1) return prices[0] || "-";
    if (selectedDuration === 7) return prices[1] || "-";
    if (selectedDuration === 30) return prices[2] || "-";
    return "-";
  };

  return (
    <div className="mx-auto p-6 pt-4 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
      {/* === BAGIAN GAMBAR === */}
      <div>
        {/* Gambar utama */}
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

        {/* Thumbnail */}
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

      {/* === BAGIAN DETAIL === */}
      <div className="flex flex-col justify-center h-full">
        {/* Nama Template */}
        <h1 className="text-4xl font-semibold mb-4 text-gray-900">
          {template.name}
        </h1>

        {/* Kategori */}
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

        {/* Deskripsi */}
        <p className="text-gray-600 mb-6">
          {template.description || "Tidak ada deskripsi."}
        </p>

        {/* Durasi & Harga */}
        <div className="mb-6">
          <div className="flex gap-3 mb-4">
            {[1, 7, 30].map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDuration(day)}
                className={`px-4 py-2 rounded-lg border transition-all ${
                  selectedDuration === day
                    ? "bg-primary text-white border-primary"
                    : "border-gray-300 text-gray-700 hover:border-gray-500"
                }`}
              >
                {day} Hari
              </button>
            ))}
          </div>

          <div className="text-3xl font-semibold text-gray-900">
            Rp.{getPriceByDuration()}
          </div>
        </div>

        {/* Tombol Aksi */}
        <div className="flex gap-8">
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
  );
}
