import Link from "next/link";
import Button from "@/components/reusable/button";

export default function NotFound() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-background text-center px-6">
      <h1 className="text-6xl font-extrabold text-primary mb-4">404</h1>
      <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
        Halaman Tidak Ditemukan
      </h2>
      <p className="text-primary mb-8 max-w-md">
        Maaf, halaman yang kamu cari tidak tersedia atau telah dipindahkan.
      </p>

      <Button label="Kembali ke Beranda" href="/" />
    </main>
  );
}
