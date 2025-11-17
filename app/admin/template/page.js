"use client";
import { useState } from "react";
import ImageUploadButton from "@/components/reusable/imageUpload";

export default function UploadTemplate() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    html: "",
    css: "",
    js: "",
    status: false,
  });
  const [images, setImages] = useState({ image1: null, image2: null, image3: null });

  const updateImage = (key, file) => setImages(prev => ({ ...prev, [key]: file }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name) return alert("Nama template wajib diisi!");

    // Upload gambar
    const formData = new FormData();
    Object.entries(images).forEach(([key, file]) => {
      if (file instanceof File) formData.append(key, file);
    });

    let uploadedUrls = {};
    if (formData.has("image1") || formData.has("image2") || formData.has("image3")) {
      const res = await fetch("/api/uploadImage", { method: "POST", body: formData });
      uploadedUrls = await res.json();
    }

    const imageArray = Object.values(uploadedUrls).filter(Boolean);

    try {
      await fetch("/api/template", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          category: form.category.split(",").map(c => c.trim()),
          price: form.price.split(",").map(p => p.trim()),
          image: imageArray,
        }),
      });

      alert("Template berhasil ditambahkan!");
      setForm({
        name: "",
        description: "",
        category: "",
        price: "",
        html: "",
        css: "",
        js: "",
        status: false,
      });
      setImages({ image1: null, image2: null, image3: null });
    } catch (err) {
      console.error(err);
      alert("Gagal menambahkan template, cek console.");
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto space-y-6">
      <h2 className="text-xl font-semibold mb-4">Tambah Template Baru</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input label="Nama Template" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
        <Input label="Deskripsi" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
        <Input label="Kategori (pisahkan koma)" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
        <Input label="Harga (pisahkan koma)" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />

        <div>
          <label className="block text-sm mb-1">HTML</label>
          <textarea value={form.html} onChange={e => setForm({ ...form, html: e.target.value })} className="w-full border rounded-md px-3 py-2 text-sm h-48 font-mono" />
        </div>

        <div>
          <label className="block text-sm mb-1">CSS</label>
          <textarea value={form.css} onChange={e => setForm({ ...form, css: e.target.value })} className="w-full border rounded-md px-3 py-2 text-sm h-48 font-mono" />
        </div>

        <div>
          <label className="block text-sm mb-1">JS</label>
          <textarea value={form.js} onChange={e => setForm({ ...form, js: e.target.value })} className="w-full border rounded-md px-3 py-2 text-sm h-48 font-mono" />
        </div>

        <h3 className="font-medium text-lg">Upload Images</h3>
        {["image1", "image2", "image3"].map(key => (
          <div key={key}>
            <label className="block text-sm mb-1 capitalize">{key}</label>
            <ImageUploadButton onFileSelect={file => updateImage(key, file)} />
          </div>
        ))}

        <button className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/80 w-full">
          Simpan Template
        </button>
      </form>
    </div>
  );
}

function Input({ label, className = "", ...props }) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input {...props} className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
    </div>
  );
}
