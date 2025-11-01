"use client";
import { useEffect } from "react";

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/service-worker.js")
          .then((reg) => {
            console.log("Service Worker registered:", reg.scope);
          })
          .catch((err) => {
            console.error("Service Worker failed:", err);
          });
      });
    }
  }, []);

  return null; // tidak render apa pun
}
