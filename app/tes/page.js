"use client";

import { useEffect, useState } from "react";

export default function TestMidtrans() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
    script.setAttribute(
      "data-client-key",
      process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY
    );
    script.async = true;
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  const runSnap = (token) => {
    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      if (typeof window.snap?.pay === "function") {
        clearInterval(interval);
        window.snap.pay(token, {
          onSuccess: (res) => alert("Pembayaran berhasil!"),
          onPending: (res) => alert("Menunggu pembayaran..."),
          onError: (res) => alert("Pembayaran gagal: " + (res?.message || "Unknown")),
        });
      } else if (attempts > 10) {
        clearInterval(interval);
        alert("Snap JS belum siap. Refresh halaman dan coba lagi.");
      }
    }, 300);
  };

  const handlePay = async () => {
    setLoading(true);
    try {
      const dummyData = {
        id: 999,
        template: "Template Dummy",
        price: 15000,
        customer: { name: "John Doe", email: "john@example.com" },
      };

      const res = await fetch("/api/site/paid", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dummyData),
      });

      const data = await res.json();

      if (!data.token) {
        alert("Gagal mendapatkan token");
        setLoading(false);
        return;
      }

      runSnap(data.token);
    } catch (err) {
      console.error(err);
      alert("Terjadi error saat membuat pembayaran");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-2xl font-bold">Percobaan Midtrans Dummy</h1>
      <button
        onClick={handlePay}
        disabled={loading}
        className={`px-6 py-3 rounded text-white ${
          loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Memproses..." : "Bayar Rp 15.000"}
      </button>
    </div>
  );
}
