"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import ImageUploadButton from "@/components/reusable/imageUpload";
import { useParams } from "next/navigation";

export default function AddSite() {
  const { id } = useParams();
  const [template, setTemplate] = useState(null);
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    name: "",
    subdomain: "",
    content: { texts: [], images: [] },
    expiredAt: "",
    status: false,
  });
  const [saving, setSaving] = useState(false);

  // Ambil data user login
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/api/auth/getMe", { withCredentials: true });
        console.log(res.data.user);
        setUser(res.data.user);
      } catch (err) {
        console.error("Gagal memuat user:", err);
        alert("Silakan login terlebih dahulu!");
      }
    };
    fetchUser();
  }, []);

  // Ambil data template berdasarkan ID
  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const res = await axios.get(`/api/template/${id}`);
        setTemplate(res.data);
        setForm((f) => ({
          ...f,
          content: {
            texts: Array(res.data.texts).fill(""),
            images: [],
          },
        }));
      } catch (err) {
        console.error(err);
      }
    };
    fetchTemplate();
  }, [id]);

  if (!template) return <p className="text-center mt-10">Memuat template...</p>;

  // Fungsi update teks
  const updateText = (index, value) => {
    const newTexts = [...form.content.texts];
    newTexts[index] = value;
    setForm((f) => ({ ...f, content: { ...f.content, texts: newTexts } }));
  };

  // Fungsi hapus gambar
  const removeImage = (url) => {
    setForm((f) => ({
      ...f,
      content: {
        ...f.content,
        images: f.content.images.filter((i) => i !== url),
      },
    }));
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.subdomain)
      return alert("Nama dan subdomain wajib diisi!");
    if (!user?.id) return alert("User belum terdeteksi. Harap login kembali!");
    if (form.content.images.length < template.images)
      return alert(`Harus upload ${template.images} gambar sesuai template!`);

    setSaving(true);
    try {
      const payload = {
        name: form.name,
        subdomain: form.subdomain,
        template: template.name,
        content: form.content,
        userId: user.id,
        expiredAt: form.expiredAt || null,
        status: form.status,
      };

      await axios.post("/api/site", payload, { withCredentials: true });
      alert("Site berhasil dibuat!");

      // Reset form
      setForm({
        name: "",
        subdomain: "",
        content: { texts: Array(template.texts).fill(""), images: [] },
        expiredAt: "",
        status: false,
      });
    } catch (err) {
      console.error(err);
      alert("Gagal menambahkan site.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 border rounded-md space-y-6">
      <h2 className="text-xl font-semibold">
        Buat Site dari Template: {template.name}
      </h2>

      {user && (
        <p className="text-sm text-gray-600">
          Login sebagai: <span className="font-medium">{user.name || user.email}</span>
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nama Site"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />

        <Input
          label="Subdomain"
          value={form.subdomain}
          onChange={(e) => setForm({ ...form, subdomain: e.target.value })}
          placeholder="contoh: mawar"
          required
        />

        <Input
          label="Tanggal Kadaluarsa (Opsional)"
          type="date"
          value={form.expiredAt}
          onChange={(e) => setForm({ ...form, expiredAt: e.target.value })}
        />

        <div>
          <label className="block text-sm font-medium mb-2">
            Isi Teks ({template.texts})
          </label>
          {form.content.texts.map((t, i) => (
            <textarea
              key={i}
              value={t}
              onChange={(e) => updateText(i, e.target.value)}
              placeholder={`Teks ${i + 1}`}
              className="w-full border rounded-md px-3 py-2 mb-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none h-16"
              required
            />
          ))}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Upload Gambar ({form.content.images.length}/{template.images})
          </label>

          <ImageUploadButton
            endpoint="imageUploader"
            maxFiles={template.images - form.content.images.length}
            onUploadComplete={(urls) =>
              setForm((f) => ({
                ...f,
                content: {
                  ...f.content,
                  images: [...f.content.images, ...urls].slice(0, template.images),
                },
              }))
            }
          />

          <div className="flex flex-wrap gap-2 mt-3">
            {form.content.images.map((url) => (
              <div key={url} className="relative group">
                <Image
                  src={url}
                  alt="Gambar"
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

        <div className="flex items-center gap-2">
          <label className="text-sm">Status Aktif:</label>
          <input
            type="checkbox"
            checked={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.checked })}
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-60"
        >
          {saving ? "Menyimpan..." : "Simpan Site"}
        </button>
      </form>
    </div>
  );
}

function Input({ label, className = "", ...props }) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        {...props}
        className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
      />
    </div>
  );
}
