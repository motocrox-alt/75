import type { Metadata } from "next";
import { Press_Start_2P, Silkscreen, Inter } from "next/font/google";
import "./globals.css";

// Títulos NES
const pressStart = Press_Start_2P({
  variable: "--font-press-start",
  weight: "400",
  subsets: ["latin"],
});

// HUD / labels
const silkscreen = Silkscreen({
  variable: "--font-silkscreen",
  weight: ["400", "700"],
  subsets: ["latin"],
});

// Texto largo
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Reto 75 Juntos",
  description: "Reto 75 Hard co-op de pareja, gamificado estilo RPG NES.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${pressStart.variable} ${silkscreen.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
