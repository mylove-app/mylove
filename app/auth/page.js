"use client";

import { useState } from "react";
import LoginPage from "@/components/auth/login";
import RegisterPage from "@/components/auth/register";

export default function AuthPage() {
  const [mode, setMode] = useState("login"); // "login" atau "register"

  const toggleMode = () => {
    setMode((prev) => (prev === "login" ? "register" : "login"));
  };

  const redirectOtp = () => {
    window.location.href = "/auth/otp";
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-md p-4">
        {mode === "login" ? <LoginPage /> : <RegisterPage />}

        <div className="text-center mt-6 text-sm">
          {mode === "login" ? ( 
            <div className="">
              <p className="text-gray-600">
                Belum punya akun?{" "}
                <button
                  onClick={toggleMode}
                  className="text-primary hover:underline font-semibold"
                >
                  Daftar sekarang
                </button>
              </p>
              <p>
                 <button
                  onClick={redirectOtp}
                  className="text-primary hover:underline font-medium"
                >
                  Lupa Password
                </button>
              </p>
            </div>
          ) : (
            <p className="text-gray-600">
              Sudah punya akun?{" "}
              <button
                onClick={toggleMode}
                className="text-primary hover:underline font-semibold"
              >
                Masuk
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
