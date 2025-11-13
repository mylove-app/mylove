"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Button from "../reusable/button";

export default function Home() {
  return (
    <section
      id="beranda"
      className="flex flex-col-reverse md:flex-row items-center justify-end md:justify-between px-6 md:px-18 py-20 md:py-18 bg-background overflow-hidden min-h-screen md:min-h-0"
    >
      {/* TEKS (muncul dari kiri) */}
      <motion.div
        className="text-center md:text-left max-w-xl"
        initial={{ opacity: 0, x: -60 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
          Hubungkan <span className="text-blue-600">Cintamu </span>Melalui
          Website
        </h1>
        <p className="text-gray-600 mb-8 text-lg">
          Ungkapkan cinta dan kasih sayang Anda kepada pasangan, keluarga, atau
          orang-orang terkasih melalui website yang personal dan berkesan.
        </p>

        <div className="flex flex-col sm:flex-row justify-center md:justify-start mt-20 md:mt-0">
          <Button label="Mulai Sekarang" href="/template" />
        </div>
      </motion.div>

      {/* GAMBAR (muncul dari kanan) */}
      <motion.div
        className="mb-10 md:mb-0"
        initial={{ opacity: 0, x: 60 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        viewport={{ once: true }}
      >
        <Image
          src="/hero.svg"
          alt="Hero Illustration"
          width={500}
          height={400}
          className="w-full h-auto"
          priority
        />
      </motion.div>
    </section>
  );
}
