"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import variable from "@/lib/variable";
import { InputAuth } from "./input";

export default function OtpPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [loadingSend, setLoadingSend] = useState(false);
  const [loadingVerify, setLoadingVerify] = useState(false);
  const [message, setMessage] = useState("");

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoadingSend(true);
    setMessage("");

    try {
      const res = await fetch(variable.otpSend, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal mengirim OTP");

      setMessage("OTP berhasil dikirim ke email kamu!");
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoadingSend(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoadingVerify(true);
    setMessage("");

    try {
      const res = await fetch(variable.otpVerify, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: otpCode }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "OTP tidak valid");

      setMessage("OTP berhasil diverifikasi! Mengalihkan...");
      setTimeout(
        () => router.push(`/auth/forgot-password?id=${data.userId}`),
        1500
      );
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoadingVerify(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-semibold text-center mb-6">
          Verifikasi Email
        </h1>

        <form className="space-y-4" onSubmit={handleVerifyOtp}>
          <div>
            <InputAuth
              type="email"
              label="Email"
              placeholder="Masukkan email kamu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <button
              type="button"
              onClick={handleSendOtp}
              disabled={loadingSend || !email}
              className="text-primary hover:underline text-xs block mt-2"
            >
              {loadingSend ? "Mengirim OTP..." : "Kirim OTP ke Email"}
            </button>
          </div>
          <InputAuth
            type="text"
            label="Kode OTP"
            placeholder="Masukkan kode OTP"
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loadingVerify || !otpCode}
            className="hover:text-primary border border-primary w-full bg-primary text-white py-2 rounded hover:bg-background disabled:bg-primary/50 disabled:border-primary/50 transition-colors"
          >
            {loadingVerify ? "Memverifikasi..." : "Verifikasi OTP"}
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
