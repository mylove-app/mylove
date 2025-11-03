"use client";

import { useState } from "react";
import axios from "axios";
import Image from "next/image";
import ImageUploadButton from "@/components/reusable/imageUpload"; // path sesuai proyek

export default function AddTemplateForm() {
  const empty = {
    name: "",
    texts: 0,
    images: 0,
    description: "",
    image: [],
    category: [""],
    price: ["", "", ""],
  };

  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  function removeImage(url) {
    setForm((s) => ({ ...s, image: s.image.filter((i) => i !== url) }));
  }

  function updateCategory(index, value) {
    const newCategories = [...form.category];
    newCategories[index] = value;
    setForm((s) => ({ ...s, category: newCategories }));
  }

  function addCategory() {
    setForm((s) => ({ ...s, category: [...s.category, ""] }));
  }

  function removeCategory(index) {
    if (form.category.length <= 1) return alert("Minimal 1 kategori wajib ada");
    setForm((s) => ({
      ...s,
      category: s.category.filter((_, i) => i !== index),
    }));
  }

  function updatePrice(index, value) {
    const newPrices = [...form.price];
    newPrices[index] = value;
    setForm((s) => ({ ...s, price: newPrices }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name) return alert("Nama template wajib diisi");
    if (form.category.some((c) => !c.trim()))
      return alert("Semua kategori harus diisi (minimal 1)");
    if (form.price.length !== 3 || form.price.some((p) => !p.trim()))
      return alert("Harus ada 3 harga dan semuanya wajib diisi");

    setSaving(true);
    try {
      await axios.post("/api/template", form);
      alert("Template berhasil ditambahkan!");
      setForm(empty);
    } catch (err) {
      alert("Gagal menambahkan template");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 max-w-md mx-auto space-y-4 border rounded"
    >
      <h2 className="text-lg font-semibold">Tambah Template</h2>

      {/* Nama Template */}
      <Input
        label="Nama Template"
        value={form.name}
        onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
        required
      />

      {/* Jumlah teks */}
      <Input
        label="Jumlah Teks"
        type="number"
        value={form.texts}
        onChange={(e) =>
          setForm((s) => ({ ...s, texts: parseInt(e.target.value) || 0 }))
        }
      />

      {/* Jumlah gambar */}
      <Input
        label="Jumlah Gambar"
        type="number"
        value={form.images}
        onChange={(e) =>
          setForm((s) => ({ ...s, images: parseInt(e.target.value) || 0 }))
        }
      />

      {/* Deskripsi */}
      <div>
        <label className="block text-sm text-slate-600 mb-1">Deskripsi</label>
        <textarea
          value={form.description}
          onChange={(e) =>
            setForm((s) => ({ ...s, description: e.target.value }))
          }
          className="w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none resize-none h-20"
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm text-slate-600 mb-1">Kategori</label>
        {form.category.map((cat, i) => (
          <div key={i} className="flex items-center gap-2 mb-2">
            <input
              type="text"
              value={cat}
              onChange={(e) => updateCategory(i, e.target.value)}
              placeholder={`Kategori ${i + 1}`}
              className="w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
              required
            />
            <button
              type="button"
              onClick={() => removeCategory(i)}
              className="bg-red-500 text-white rounded px-2 py-1 text-sm hover:bg-red-600"
            >
              ×
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addCategory}
          className="text-sm text-blue-600 hover:underline"
        >
          + Tambah Kategori
        </button>
      </div>

      {/* Price */}
      <div>
        <label className="block text-sm text-slate-600 mb-1">Harga (3 Tingkatan)</label>
        {form.price.map((p, i) => (
          <div key={i} className="mb-2">
            <input
              type="number"
              value={p}
              onChange={(e) => updatePrice(i, e.target.value)}
              placeholder={`Harga ${i + 1}`}
              className="w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
              required
            />
          </div>
        ))}
      </div>

      {/* Upload Gambar */}
      <div>
        <label className="block text-sm mb-1 text-slate-600">Upload Gambar</label>
        <ImageUploadButton
          endpoint="imageUploader"
          maxFiles={5}
          onUploadComplete={(urls) =>
            setForm((s) => ({ ...s, image: [...s.image, ...urls].slice(0, 5) }))
          }
        />

        <div className="flex flex-wrap gap-2 mt-3">
          {form.image.map((url) => (
            <div key={url} className="relative group">
              <Image
                src={url}
                alt="Gambar template"
                width={96}
                height={96}
                className="object-cover rounded border"
              />
              <button
                type="button"
                onClick={() => removeImage(url)}
                className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-60"
      >
        {saving ? "Menyimpan..." : "Simpan Template"}
      </button>
    </form>
  );
}

// Reusable Input
function Input({ label, className = "", ...props }) {
  return (
    <div className={className}>
      <label className="block text-sm text-slate-600 mb-1">{label}</label>
      <input
        {...props}
        className="w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
      />
    </div>
  );
}
