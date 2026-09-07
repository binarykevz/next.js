import type { Metadata } from "next";
import { Cinzel, IM_Fell_English, Unica_One } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const cinzel = Cinzel({ subsets: ["latin"], variable: "--font-cinzel" });
const fell = IM_Fell_English({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-fell",
});

export const metadata: Metadata = {
  title: "The Great Voyage — Expedition Journal",
  description: "The Great Voyage — an ancient magical expedition across the world.",
};

export default function RootLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cinzel.variable} ${fell.variable}`}>
      <body className="font-fell">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
