"use client";

import { motion } from "framer-motion";

export default function Title({ children }) {
  return (
    <motion.h1
      className="text-2xl font-bold text-start mb-10 border-l-4 border-primary pl-4"
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true }}
    >
      {children}
    </motion.h1>
  );
}
