"use client";

import { Suspense } from "react";
import ForgotPasswordPage from "@/components/auth/forgotPassword";

export default function ForgotPassword() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ForgotPasswordPage />
    </Suspense>
  );
}