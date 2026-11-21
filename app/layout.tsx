import type { Metadata } from "next";
import { Inter, Lora } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Acquittal",
  description:
    "Practice asking better questions, checking AI answers, and making thoughtful choices through three courtroom games.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="chambers" className={`${inter.variable} ${lora.variable}`}>
      <body className="bg-base-300 text-base-content">{children}</body>
    </html>
  );
}
