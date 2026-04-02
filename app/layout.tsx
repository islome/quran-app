// app/layout.tsx
import type { Metadata } from "next";
import { Amiri } from "next/font/google";
import "./globals.css";

const amiri = Amiri({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  variable: "--font-amiri",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Al-Qur'an - Muqaddas Kitob",
  description:
    "Qur'oni Karimni o'qish, tinglash va sevimlilarga saqlash uchun zamonaviy web ilova",
  icons: {
    icon: "/icon.png", 
    apple: "/icon.png", 
  },
  openGraph: {
    title: "Al-Qur'an",
    description: "Qur'oni Karimni o'qish va tinglash",
    images: [{ url: "/icon.png" }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uz" className="dark">
      <body
        className={`${amiri.variable} antialiased bg-[#050505] text-[#f1f1f1]`}
      >
        {children}
      </body>
    </html>
  );
}
