"use client";

import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import Image from "next/image";
import ImageUploadButton from "@/components/reusable/imageUpload";
import { extractFields } from "@/lib/extractField";
import { useParams } from "next/navigation";

export default function Editor() {
  const { id: templateId } = useParams();
  const [template, setTemplate] = useState(null);
  const [user, setUser] = useState(null);

  const [content, setContent] = useState({}); // text atau File
  const [form, setForm] = useState({
    name: "",
    subdomain: "",
    expiredAt: "",
    status: false,
  });

  // Ambil user
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await axios.get("/api/auth/getMe", { withCredentials: true });
        setUser(res.data.user);
      } catch {
        alert("Silakan login terlebih dahulu!");
      }
    }
    fetchUser();
  }, []);

  // Ambil template
  useEffect(() => {
    async function loadTemplate() {
      try {
        const res = await fetch(`/api/template/${templateId}`);
        const data = await res.json();
        setTemplate(data);

        const fields = extractFields(data);
        const initialContent = {};
        fields.forEach((key) => (initialContent[key] = ""));
        setContent(initialContent);
      } catch (err) {
        console.error(err);
      }
    }
    loadTemplate();
  }, [templateId]);

  // Preview live
  const previewHTML = useMemo(() => {
    if (!template) return "";
    let html = `
      <style>${template.css || ""}</style>
      ${template.html || ""}
      <script>${template.js || ""}</script>
    `;
    Object.keys(content).forEach((key) => {
      let value = content[key];
      if (value instanceof File) value = URL.createObjectURL(value);
      html = html.replaceAll(`{{${key}}}`, value || "");
    });
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <style>
            @media (max-width: 420px) {
              ::-webkit-scrollbar { width: 5px; }
              ::-webkit-scrollbar-thumb { background: #555; border-radius: 10px; }
              ::-webkit-scrollbar-track { background: #181818; }
            }
            ${template.css || ""}
          </style>
        </head>
        <body>${html}</body>
      </html>
    `;
  }, [template, content]);

  if (!template) return <p className="text-center mt-10">Memuat template...</p>;

  const updateText = (key, value) => setContent(prev => ({ ...prev, [key]: value }));
  const updateImage = (key, file) => setContent(prev => ({ ...prev, [key]: file }));

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.subdomain) return alert("Nama & subdomain wajib diisi!");
    if (!user?.id) return alert("User belum terdeteksi!");

    const formData = new FormData();
    Object.keys(content).forEach(key => {
      if (content[key] instanceof File) formData.append(key, content[key]);
    });

    // Upload ke /api/uploadImage
    let uploadedUrls = {};
    if (formData.has("image1") || formData.has("image2") || formData.has("image3")) {
      const res = await fetch("/api/uploadImage", { method: "POST", body: formData });
      uploadedUrls = await res.json();
    }

    const finalContent = { ...content };
    Object.keys(uploadedUrls).forEach(key => finalContent[key] = uploadedUrls[key]);

    try {
      await axios.post("/api/site", { ...form, content: finalContent, userId: user.id, templateId }, { withCredentials: true });
      alert("Website berhasil dibuat!");
      setForm({ name: "", subdomain: "", expiredAt: "", status: false });
      setContent({});
    } catch (err) {
      console.error("Axios error:", err.response?.data || err.message);
      alert("Gagal membuat site, cek console.");
    }
  };

  const fields = extractFields(template);

  return (
    <div className="h-[88vh] w-full flex overflow-hidden relative">
      {/* Sidebar */}
      <div className="w-[350px] h-[85vh] bg-white p-4 overflow-y-auto absolute left-0 top-0 z-20">
        <h2 className="text-xl font-semibold">Buat Website: {template.name}</h2>
        {user && <p className="text-sm text-gray-600 mb-4">Login sebagai: <strong>{user.name || user.email}</strong></p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input label="Nama Website" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          <Input label="Subdomain" value={form.subdomain} placeholder="contoh: tokoku" onChange={e => setForm({ ...form, subdomain: e.target.value })} required />
          <Input label="Tanggal Expired (Opsional)" type="date" value={form.expiredAt} onChange={e => setForm({ ...form, expiredAt: e.target.value })} />

          <h3 className="font-medium text-lg">Isi Konten Template</h3>
          {fields.map((key) => (
            <div key={key} className="mb-4">
              {key.toLowerCase().includes("image") ? (
                <div>
                  <label className="block text-sm mb-1 capitalize">{key}</label>
                  <ImageUploadButton onFileSelect={(file) => updateImage(key, file)} />
                  {content[key] && !(content[key] instanceof File) && (
                    <Image src={content[key]} alt="preview" width={120} height={120} className="rounded border mt-2" />
                  )}
                </div>
              ) : (
                <Input label={key} value={content[key] || ""} onChange={e => updateText(key, e.target.value)} />
              )}
            </div>
          ))}

          <div className="flex items-center gap-2">
            <label>Status Aktif:</label>
            <input type="checkbox" checked={form.status} onChange={e => setForm({ ...form, status: e.target.checked })} />
          </div>

          <button className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/80 w-full">Publish Website</button>
        </form>
      </div>

      {/* Preview */}
      <div className="flex-1 h-full ml-[350px] bg-background">
        <iframe srcDoc={previewHTML} className="w-full h-full border-none" style={{ pointerEvents: "auto" }} />
      </div>
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
