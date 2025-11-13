"use client";

import { motion } from "framer-motion";
import Title from "@/components/reusable/title";
import { Heart, Globe, Clock } from "lucide-react";

const features = [
  {
    title: "Desain Menawan",
    description: "Template surat cinta dan undangan minimalis siap pakai.",
    icon: <Heart className="w-10 h-10 text-primary" />,
  },
  {
    title: "Subdomain Unik",
    description: "Dapatkan link pribadi milikmu",
    icon: <Globe className="w-10 h-10 text-primary" />,
  },
  {
    title: "Harga Hemat",
    description: "Mulai dari Rp15.000 untuk 3 hari aktif.",
    icon: <Clock className="w-10 h-10 text-primary" />,
  },
];

// Variants untuk animasi
const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.6, ease: "easeOut" },
  }),
};

export default function FeaturedPage() {
  return (
    <main className="py-16 px-8 overflow-hidden">
      <Title>Fitur Unggulan</Title>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            custom={index}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow border-2 border-transparent hover:border-primary"
          >
            <div className="mb-4 flex justify-center">{feature.icon}</div>
            <h2 className="text-xl font-semibold mb-2 text-center">
              {feature.title}
            </h2>
            <p className="text-gray-600 text-center">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </main>
  );
}
