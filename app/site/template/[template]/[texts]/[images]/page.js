"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

export default function TemplatePageClient() {
  const params = useParams();
  const template = params.template;
  const textsCount = parseInt(params.texts || "0");
  const imagesCount = parseInt(params.images || "0");

  const [form, setForm] = useState({
    name: "",
    subdomain: "",
    texts: Array(textsCount).fill(""),
    images: Array(imagesCount).fill(null),
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setForm({
      name: "",
      subdomain: "",
      texts: Array(textsCount).fill(""),
      images: Array(imagesCount).fill(null),
    });
  }, [textsCount, imagesCount]);

  const handleTextChange = (index, value) => {
    setForm(prev => {
      const newTexts = [...prev.texts];
      newTexts[index] = value;
      return { ...prev, texts: newTexts };
    });
  };

  const handleImageChange = (index, file) => {
    setForm(prev => {
      const newImages = [...prev.images];
      newImages[index] = file;
      return { ...prev, images: newImages };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("subdomain", form.subdomain);
      formData.append("template", template);

      form.texts.forEach((text, i) => formData.append(`texts[${i}]`, text));
      form.images.forEach(file => file && formData.append("images", file));

      const res = await fetch("/api/site", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Gagal membuat site");

      setMessage("Site berhasil dibuat!");
      setForm({
        name: "",
        subdomain: "",
        texts: Array(textsCount).fill(""),
        images: Array(imagesCount).fill(null),
      });
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">
        Form {template} ({textsCount} teks, {imagesCount} gambar)
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Nama Site</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border p-2 w-full"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Subdomain</label>
          <input
            type="text"
            value={form.subdomain}
            onChange={(e) => setForm({ ...form, subdomain: e.target.value })}
            className="border p-2 w-full"
            required
          />
        </div>

        {form.texts.map((text, i) => (
          <div key={i}>
            <label className="block mb-1">Text {i + 1}</label>
            <input
              type="text"
              value={text}
              onChange={(e) => handleTextChange(i, e.target.value)}
              className="border p-2 w-full"
            />
          </div>
        ))}

        {form.images.map((img, i) => (
          <div key={i}>
            <label className="block mb-1">Image {i + 1}</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(i, e.target.files[0])}
              className="border p-2 w-full"
            />
          </div>
        ))}

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Membuat..." : "Submit"}
        </button>
      </form>

      {message && <p className="mt-4">{message}</p>}
    </div>
  );
}
 