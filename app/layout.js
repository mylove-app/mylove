import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ServiceWorkerRegister from "@/components/reusable/serviceWorker";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "myLove - Buat Website Cinta Kamu dengan Mudah",
  description: "myLove adalah platform layanan pembuatan website untuk pasangan dan cerita cinta. Buat website personal, undangan digital, atau portofolio cinta dengan cepat dan mudah.",
   other: {
    "google-site-verification": "A4pyOrXX1jQY9jn3SRuPdSbh5GwBMJQoDboBCWiETc4",
  },
  keywords: "website cinta, website pasangan, website couple, website romantis, website jadian, website anniversary, website hubungan, love website, couple website, relationship website, website untuk pasangan, website love story, cerita cinta online, portofolio cinta, galeri cinta digital, website biodata pasangan, website couple aesthetic, website untuk memperingati hubungan, website hadiah untuk pasangan, hadiah anniversary online, website ulang tahun pacar, website untuk suami istri, website love journal, website kenangan bersama, website foto pasangan, website galeri romantis, website dokumentasi cinta, template website cinta, template website romantis, template website pasangan, template couple aesthetic, template undangan digital, undangan digital, wedding invitation online, undangan pernikahan digital, kartu undangan online, undangan digital premium, undangan digital elegan, undangan digital modern, wedding website, website pernikahan, website lamaran digital, landing page pasangan, landing page romantis, landing page untuk pacar, landing page hadiah cinta, customizable couple website, website custom pasangan, website couple gratis, website cinta gratis, generator website cinta, pembuat website undangan, pembuat website pasangan, myLove website, myLove template, myLove portfolio, website aesthetic pasangan, website couple dark mode, website couple modern minimalis, website couple responsive, mini website pasangan, microsite pasangan, microsite undangan digital, website cinta simple, website cinta keren, website cinta aesthetic, website story relationship, website perjalanan cinta, timeline cinta online, website perayaan hubungan, website love day, website hari jadian, website sweet moment, website gallery couple, website couple gift, website hadiah pacar, website valentines online, website untuk orang tersayang, website untuk pacar, website kejutan online, website secret message pasangan, website puisi cinta, website quotes cinta, website video cinta, website audio romantis, website bio pasangan, website profil pasangan, website linktree pasangan, link bio pasangan, link bio cinta, website untuk memperkenalkan pasangan, template pasangan HTML, template portfolio cinta HTML, template undangan HTML, template website couple gratis, template website couple premium, platform website pasangan, website love microsite builder, website undangan generator, website couple generator, website gift builder, web app cinta pasangan",
  authors: [{ name: "myLove Team", url: "https://mylove.my.id" }],
  openGraph: {
    title: "myLove - Buat Website Cinta Kamu dengan Mudah",
    description: "Platform layanan pembuatan website untuk pasangan dan cerita cinta. Pilih template, kustomisasi, dan bagikan kisah cintamu.",
    url: "https://mylove.my.id",
    siteName: "myLove",
    images: [
      {
        url: "https://mylove.my.id/logo.png",
        width: 1200,
        height: 630,
        alt: "myLove - Platform Website Cinta",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "myLove - Buat Website Cinta Kamu dengan Mudah",
    description: "Platform layanan pembuatan website untuk pasangan dan cerita cinta. Buat website personal, undangan digital, atau portofolio cinta.",
    images: ["https://mylove.my.id/logo.png"],
  },
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ServiceWorkerRegister />
        {children}
      </body>
    </html>
  );
}
