// components/reusable/NotFound.js
import Button from "@/components/reusable/button";

export default function NotFound({
  title = "Halaman Tidak Ditemukan",
  code = "404",
  message = "Maaf, halaman yang kamu cari tidak tersedia atau telah dipindahkan.",
  buttonLabel = "Kembali ke Beranda",
  buttonHref = "/"
}) {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-background text-center px-6">
      <h1 className="text-6xl font-extrabold text-primary mb-4">{code}</h1>
      <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{title}</h2>
      <p className="text-primary mb-8 max-w-md">{message}</p>

      <Button label={buttonLabel} href={buttonHref} />
    </main>
  );
}
