"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function Template1({ content }) {
  const { title, images = [], description, contact } = content;

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-rose-50 to-pink-100 text-gray-800 flex flex-col items-center justify-center overflow-hidden">
      {/* Background floral overlay */}
      <div className="absolute inset-0 -z-10 opacity-20">
        {images.slice(0, 3).map((img, i) => (
          <Image
            key={i}
            src={img}
            alt={`background-${i}`}
            fill
            className="object-cover object-center"
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-pink-100/70 via-rose-100/60 to-white/80 backdrop-blur-sm"></div>
      </div>

      {/* Surat card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
        className="max-w-2xl bg-white/70 backdrop-blur-md shadow-lg rounded-3xl p-8 mx-4 border border-rose-200"
      >
        <h1 className="text-3xl font-serif text-center text-rose-700 mb-6">
          {title || "Surat Cinta 🌹"}
        </h1>

        <p className="text-lg leading-relaxed text-gray-700 font-light whitespace-pre-line">
          {description ||
            `Aku menulis surat ini bukan karena aku ingin kau tahu, 
tetapi karena aku tak sanggup menyimpan semua rasa yang tumbuh setiap kali namamu terlintas.`}
        </p>

        {/* Divider */}
        <div className="my-8 border-t border-rose-200 w-1/2 mx-auto"></div>

        {/* Pengirim */}
        <div className="text-right font-medium text-gray-800">
          <p>Dengan penuh cinta,</p>
          <p className="text-rose-600 text-xl mt-2 font-dancing">
            {contact?.email?.includes("example.com")
              ? "Seseorang yang mencintaimu"
              : "Muhamad Syarif Nurrohman"}
          </p>
        </div>
      </motion.div>

      {/* Footer / kontak */}
      <div className="mt-10 text-center text-gray-600 text-sm">
        <p>
          ✉️ {contact?.email} | 📞 {contact?.phone} | 📍 {contact?.address}
        </p>
      </div>
    </div>
  );
}
