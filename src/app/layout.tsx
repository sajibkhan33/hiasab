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
  title: "দৈনিক হিসাব - সহজ আয় ও ব্যয় ট্র্যাকার | Doinik Hisab",
  description: "প্রতিদিনের আয় ও খরচের হিসাব রাখার সবচেয়ে সহজ ও নির্ভরযোগ্য সমাধান।",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="bn"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-800 selection:bg-emerald-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
