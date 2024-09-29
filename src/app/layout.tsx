import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import AdminBar from "@/components/AdminBar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CMS",
  description: "Content Management System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-gray-900 text-white min-h-screen`}
      >
        <AdminBar />
        {children}
      </body>
    </html>
  );
}
