import "./globals.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type React from "react";
import type { JSX } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "OpenEats Partner Portal",
  description: "Partner portal for restaurants, drivers, and administrators",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): JSX.Element {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
