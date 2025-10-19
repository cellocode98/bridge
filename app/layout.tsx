// app/layout.tsx
import "./globals.css";
import { Inter } from "next/font/google";
import { AuthProvider } from "../src/components/AuthProvider";
import Navbar from "../src/components/Navbar";
import Footer from "../src/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Bridge MVP",
  description: "Volunteer bridge app",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Inline fallback style used only for diagnosing CSS loading issues */}
        <AuthProvider>
          <Navbar />
          {children}
          <Footer />   
        </AuthProvider>
      </body>
    </html>
  );
}
