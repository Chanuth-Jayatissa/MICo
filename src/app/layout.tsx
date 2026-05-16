import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "MICo — Michigan Community Platform",
  description:
    "AI-powered community platform connecting Michigan talent with local tech events, job opportunities, and insider referrals — powered by IBM watsonx.",
  keywords: [
    "Michigan",
    "tech community",
    "jobs",
    "events",
    "AI",
    "IBM watsonx",
    "referrals",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} h-full`}
    >
      <body className="min-h-full bg-surface-light font-body text-slate-iron antialiased">
        {children}
      </body>
    </html>
  );
}
