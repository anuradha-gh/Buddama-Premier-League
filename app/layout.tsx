import type { Metadata } from "next";
import { Bebas_Neue, Inter } from "next/font/google";
import "./globals.css";

const bebasNeue = Bebas_Neue({
  weight: "400",
  variable: "--font-bebas",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BPL - Buddama Premier League",
  description: "Official Web Application for BPL",
  icons: {
    icon: "/BPL-icon.png",
    apple: "/BPL-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${bebasNeue.variable} ${inter.variable} font-sans antialiased bg-slate-950 text-white`}
      >
        {children}
      </body>
    </html>
  );
}
