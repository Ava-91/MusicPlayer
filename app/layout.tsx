import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "MusicPlayer",
    template: "%s | MusicPlayer",
  },
  description:
    "A beautiful modern music player built with Next.js, React and Tailwind CSS. Featuring glassmorphism, glowing UI, smooth animations and cozy late-night coding vibes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body
        className="
          min-h-screen
          bg-zinc-950
          text-white
          antialiased
          overflow-x-hidden
          selection:bg-blue-500
          selection:text-white
        "
      >
        {children}
      </body>
    </html>
  );
}