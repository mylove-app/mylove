import Image from "next/image";
import Button from "../reusable/button";

export default function HeroSection() {
  return (
    <section className="flex flex-col-reverse md:flex-row items-center justify-between px-6 md:px-18 py-20 bgbackground">
      <div className="text-center md:text-left max-w-xl">
        <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
          Hubungkan <span className="text-blue-600">Cintamu </span>Melalui
          Website
        </h1>
        <p className="text-gray-600 mb-8 text-lg">
          Ungkapkan cinta dan kasih sayang Anda kepada pasangan, keluarga, atau
          orang-orang terkasih melalui website yang personal dan berkesan.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
          <Button label="Mulai Sekarang" href="/daftar" />
        </div>
      </div>
      <div className="mb-10 md:mb-0">
        <Image
          src="/hero.svg"
          alt="Hero Illustration"
          width={500}
          height={400}
          className="w-full h-auto"
          priority
        />
      </div>
    </section>
  );
}
