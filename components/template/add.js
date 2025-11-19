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
  const [loading, setLoading] = useState(false);

  const [content, setContent] = useState({});
  const [form, setForm] = useState({
    name: "",
    subdomain: "",
  });

  const [priceIndex, setPriceIndex] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await axios.get("/api/auth/getMe", {
          withCredentials: true,
        });
        setUser(res.data.user);
      } catch {
        alert("Silakan login terlebih dahulu");
      }
    }
    fetchUser();
  }, []);

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

  useEffect(() => {
  const script = document.createElement("script");
  script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
  script.setAttribute("data-client-key", process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY);
  document.body.appendChild(script);
}, []);


  const calculateExpiration = (index) => {
    const now = new Date();
    if (index === 0) now.setDate(now.getDate() + 3);
    else if (index === 1) now.setDate(now.getDate() + 7);
    else if (index === 2) now.setMonth(now.getMonth() + 1);
    return now.toISOString();
  };

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

  const updateText = (key, value) =>
    setContent((prev) => ({ ...prev, [key]: value }));

  const updateImage = (key, file) =>
    setContent((prev) => ({ ...prev, [key]: file }));

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!form.name || !form.subdomain)
    return alert("Nama dan subdomain wajib diisi");

  if (priceIndex === null) return alert("Pilih durasi paket terlebih dahulu");

  if (!user?.id) return alert("User tidak ditemukan");
  setLoading(true);

  const autoExpiredAt = calculateExpiration(priceIndex);

  const formData = new FormData();
  Object.keys(content).forEach((key) => {
    if (content[key] instanceof File) {
      formData.append(key, content[key]);
    }
  });

  let uploadedUrls = {};
  if ([...formData.keys()].length > 0) {
    const res = await fetch("/api/uploadImage", {
      method: "POST",
      body: formData,
    });
    uploadedUrls = await res.json();
  }

  const finalContent = { ...content };
  Object.keys(uploadedUrls).forEach((key) => {
    finalContent[key] = uploadedUrls[key];
  });

  try {
    // 1. SIMPAN WEBSITE
    const siteRes = await axios.post(
      "/api/site",
      {
        ...form,
        content: finalContent,
        status: false,
        expiredAt: autoExpiredAt,
        userId: user.id,
        templateId,
        priceIndex,
      },
      { withCredentials: true }
    );

    const site = siteRes.data;

    // 2. PANGGIL API MIDTRANS
    const payRes = await axios.post("/api/paid", {
  id: site.id,
  template: template.id,
  price: priceIndex,
});


    const { token } = payRes.data;

    // 3. POPUP SNAP
    window.snap.pay(token, {
      onSuccess: function () {
        alert("Pembayaran berhasil!");
      },
      onPending: function () {
        alert("Menunggu pembayaran...");
      },
      onError: function () {
        alert("Pembayaran gagal");
      },
    });

  } catch (err) {
    console.error(err.response?.data || err.message);
    alert("Gagal membuat website");
  }

  setLoading(false);
};


  const fields = extractFields(template);

  const getButtonText = () => {
    if (loading) return "Memproses...";
    if (priceIndex === null) return "Publish Website";

    const label =
      priceIndex === 0 ? "3 Hari" : priceIndex === 1 ? "7 Hari" : "1 Bulan";

    const price = template.price[priceIndex];

    return `Rp ${price}`;
  };

  return (
    <div className="h-[88vh] w-full flex overflow-hidden relative">
      <div className="w-[350px] h-[85vh] bg-white p-4 overflow-y-auto absolute left-0 top-0 z-20">
        <h2 className="text-xl font-semibold">{template.name}</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Nama Website"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />

          <Input
            label="Subdomain"
            placeholder="contoh: tokoku"
            value={form.subdomain}
            onChange={(e) => setForm({ ...form, subdomain: e.target.value })}
            required
          />

          <h3 className="font-medium text-lg">Isi Konten Template</h3>

          {fields.map((key) => (
            <div key={key} className="mb-4">
              {key.toLowerCase().includes("image") ? (
                <div>
                  <label className="block text-sm mb-1 capitalize">{key}</label>
                  <ImageUploadButton
                    onFileSelect={(file) => updateImage(key, file)}
                  />
                </div>
              ) : (
                <Input
                  label={key}
                  value={content[key] || ""}
                  onChange={(e) => updateText(key, e.target.value)}
                />
              )}
            </div>
          ))}

          <div className="flex flex-col gap-2">
            <label className="block text-sm font-medium mb-1">
              Pilih Durasi
            </label>

            <div className="flex gap-3 items-center justify-center">
              {/* 3 HARI */}
              <button
                type="button"
                onClick={() => setPriceIndex(0)}
                className={`px-4 py-2 border rounded-md ${
                  priceIndex === 0 ? "bg-blue-600 text-white" : "bg-white"
                }`}
              >
                3 Hari
              </button>

              {/* 7 HARI */}
              <button
                type="button"
                onClick={() => setPriceIndex(1)}
                className={`px-4 py-2 border rounded-md ${
                  priceIndex === 1 ? "bg-blue-600 text-white" : "bg-white"
                }`}
              >
                7 Hari
              </button>

              <button
                type="button"
                onClick={() => setPriceIndex(2)}
                className={`px-4 py-2 border rounded-md ${
                  priceIndex === 2 ? "bg-blue-600 text-white" : "bg-white"
                }`}
              >
                1 Bulan
              </button>
            </div>
          </div>

          <button
            disabled={loading}
            className={`px-4 py-2 rounded w-full text-white
    ${
      loading
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-primary hover:bg-primary/80"
    }
  `}
          >
            {getButtonText()}
          </button>
        </form>
      </div>

      <div className="flex-1 h-full ml-[350px] bg-background">
        <iframe
          srcDoc={previewHTML}
          className="w-full h-full border-none"
          style={{ pointerEvents: "auto" }}
        />
      </div>
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
