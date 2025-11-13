"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"
import Title from "../reusable/title"

const faqs = [
  {
    question: "Apakah membuat situs di sini gratis?",
    answer:
      "Tidak. Setiap template memiliki harga masing-masing, mulai dari Rp15.000 untuk masa aktif 3 hari.",
  },
  {
    question: "Berapa lama proses situs menjadi aktif?",
    answer:
      "Setelah pembayaran dikonfirmasi, situsmu langsung aktif dalam beberapa menit saja.",
  },
  {
    question: "Apakah saya bisa mengganti template setelah membeli?",
    answer:
      "Tidak bisa. Setiap pembelian berlaku untuk satu template tertentu. Jika ingin menggunakan template lain, kamu perlu melakukan pembelian baru.",
  },
  {
    question: "Bagaimana cara membagikan situs saya?",
    answer:
      "Setelah situs aktif, kamu akan mendapat subdomain unik seperti nama.mylove.my.id yang bisa langsung dibagikan ke siapa pun.",
  },
]

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(null)

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="relative py-20 px-8 bg-white overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-white to-blue-50 opacity-70 blur-3xl"></div>

      <div className="relative">
        <Title>Pertanyaan Umum</Title>

        <div className="space-y-4">
          {faqs.map((item, i) => (
            <div
              key={i}
              className="border border-gray-200 rounded-2xl bg-white shadow-sm overflow-hidden"
            >
              <button
                onClick={() => toggle(i)}
                className="w-full flex justify-between items-center text-left p-5 focus:outline-none"
              >
                <span className="font-semibold text-gray-800">
                  {item.question}
                </span>
                <motion.div
                  animate={{ rotate: openIndex === i ? 180 : 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                </motion.div>
              </button>

              <AnimatePresence initial={false}>
                {openIndex === i && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-5 pb-5 text-gray-600 text-sm leading-relaxed">
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
