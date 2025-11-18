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
  keywords: "website cinta, website pasangan, undangan digital, portofolio cinta, template website, myLove",
  authors: [{ name: "myLove Team", url: "https://mylove.my.id" }],
  openGraph: {
    title: "myLove - Buat Website Cinta Kamu dengan Mudah",
    description: "Platform layanan pembuatan website untuk pasangan dan cerita cinta. Pilih template, kustomisasi, dan bagikan kisah cintamu.",
    url: "https://mylove.my.id",
    siteName: "myLove",
    images: [
      {
        url: "https://mylove.my.id/og-image.png",
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
    images: ["https://mylove.my.id/og-image.png"],
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
