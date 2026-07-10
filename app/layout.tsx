import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "MusicPlayer",
    template: "%s | MusicPlayer",
  },
  description:
    "A modern music player built with Next.js, React and Tailwind CSS.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geist.className} bg-zinc-950 text-white min-h-screen antialiased`}
      >
        {children}
      </body>
    </html>
  );
}