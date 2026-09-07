import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Great Voyage — Expedition Journal",
  description:
    "The Great Voyage — an ancient magical expedition across the world.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
