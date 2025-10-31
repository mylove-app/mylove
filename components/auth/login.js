"use client";

import { useState } from "react";
import { InputAuth } from "@/components/auth/input";
import { useRouter } from "next/navigation";
import variable from "@/lib/variable";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
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
      const res = await fetch(variable.login, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Terjadi kesalahan");

      router.push("/");
      setForm({ email: "", password: "" });
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto">
      <h1 className="text-2xl font-semibold text-center mb-6">Login</h1>

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
        {loading ? "Masuk..." : "Login"}
      </button>

      {message && (
        <p className="mt-4 text-center text-sm text-gray-700">{message}</p>
      )}
    </form>
  );
}
