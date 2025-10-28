"use client"
// app/layout.tsx
import "./globals.css";
import { Inter } from "next/font/google";
import { AuthProvider } from "../src/components/AuthProvider";
import Navbar from "../src/components/Navbar";
import Footer from "../src/components/Footer";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Try to grab page title from an element with data-page-title
    const el = document.querySelector("[data-page-title]");
    const pageTitle = el?.getAttribute("data-page-title");
    document.title = pageTitle ? `Bridge | ${pageTitle}` : "Bridge";
  }, []);

  return (
    <html lang="en">
      <body className={`${inter.className} bg-blue-50 text-gray-800 min-h-screen flex flex-col`}>
        <AuthProvider>
          <Navbar />

          <main className="flex-grow w-full">
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                style: { background: "#333", color: "#fff" },
                success: { iconTheme: { primary: "#4ade80", secondary: "#333" } },
              }}
            />
          </main>

          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
