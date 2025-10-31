"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import variable from "@/lib/variable";
import { InputAuth } from "./input";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const params = useSearchParams();
  const userId = params.get("id");

  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!userId) {
      router.push("/auth/otp");
    }
  }, [userId, router]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (form.password !== form.confirmPassword) {
      setMessage("Password tidak cocok!");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${variable.authId}/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password: form.password,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal mengubah password");

      setMessage("Password berhasil diubah! Mengalihkan ke login...");
      setTimeout(() => router.push("/auth/login"), 2000);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-semibold text-center mb-6">
          Atur Ulang Password
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputAuth
            type="password"
            name="password"
            label="Password Baru"
            placeholder="Masukkan password baru"
            value={form.password}
            onChange={handleChange}
            required
          />

          <InputAuth
            type="password"
            name="confirmPassword"
            label="Konfirmasi Password"
            placeholder="Masukkan kembali password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            error={form.confirmPassword && form.password !== form.confirmPassword}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-2 rounded hover:bg-background hover:text-primary border border-primary disabled:bg-primary/50 transition-colors"
          >
            {loading ? "Memproses..." : "Ubah Password"}
          </button>
        </form>

        {message && (
          <p
            className={`mt-4 text-center text-sm ${
              message.toLowerCase().includes("berhasil")
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
