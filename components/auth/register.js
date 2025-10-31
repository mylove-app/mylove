"use client";

import { useState } from "react";
import { InputAuth } from "@/components/auth/input";
import { useRouter } from "next/navigation";
import variable from "@/lib/variable";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(variable.register, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Terjadi kesalahan");

      setForm({ name: "", email: "", password: "" });
      setMessage("Pendaftaran berhasil!");
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto">
      <h1 className="text-2xl font-semibold text-center mb-6">Daftar</h1>

      <div className="mb-3">
        <InputAuth
          label="Nama Lengkap"
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Nama Lengkap"
          required
        />
      </div>

      <div className="mb-3">
        <InputAuth
          label="Email"
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
      </div>

      <div className="mb-4">
        <InputAuth
          label="Password"
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary text-background py-2 rounded-[8px] hover:bg-background hover:text-primary border border-primary disabled:bg-primary/50 disabled:border-primary/50"
      >
        {loading ? "Mendaftar..." : "Daftar"}
      </button>

      {message && (
        <p className="mt-4 text-center text-sm text-gray-700">{message}</p>
      )}
    </form>
  );
}
