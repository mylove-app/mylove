"use client";

import { motion } from "framer-motion";
import { LayoutTemplate, Image, Globe, CreditCard } from "lucide-react";
import Title from "../reusable/title";

const steps = [
  {
    title: "Pilih Template",
    description: "Mulai dari desain favoritmu.",
    icon: <LayoutTemplate className="w-8 h-8 text-primary" />,
  },
  {
    title: "Isi Konten",
    description: "Tambahkan teks dan gambar sesukamu.",
    icon: <Image className="w-8 h-8 text-primary" />,
  },
  {
    title: "Atur Subdomain",
    description: "Gunakan nama unik seperti nama.mylove.my.id.",
    icon: <Globe className="w-8 h-8 text-primary" />,
  },
  {
    title: "Bayar & Online",
    description: "Situs langsung aktif dan siap dibagikan.",
    icon: <CreditCard className="w-8 h-8 text-primary" />,
  },
];

export default function ProcessPage() {
  return (
    <section className="relative py-20 bg-white px-8">
      <div className="text-center">
        <Title>Cara Kerja</Title>

        <div className="relative flex flex-col md:flex-row items-center justify-between gap-12 md:gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              viewport={{ once: true }}
              className="flex flex-col items-center text-center relative"
            >
              {/* Lingkaran Icon */}
              <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-background shadow-md hover:shadow-lg transition-shadow">
                {step.icon}
              </div>

              {/* Garis penghubung di tengah antar lingkaran */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 left-full w-24 h-[2px] bg-primary -translate-y-1/2 translate-x-1/2" />
              )}

              {/* Teks */}
              <h3 className="mt-4 text-base font-semibold text-gray-800">
                {step.title}
              </h3>
              <p className="text-sm text-gray-600 mt-1 max-w-[160px]">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
