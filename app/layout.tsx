// app/layout.tsx
import "./globals.css";
import { Inter } from "next/font/google";
import { AuthProvider } from "../src/components/AuthProvider";
import Navbar from "../src/components/Navbar";
import Footer from "../src/components/Footer";
import { Toaster } from "react-hot-toast";


const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Bridge MVP",
  description: "Volunteer bridge app",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-blue-50 text-gray-800 min-h-screen flex flex-col`}
      >
        <AuthProvider>
          {/* Navbar at the top */}
          <Navbar />

          {/* Main content grows to fill available space */}
          <main className="flex-grow w-full">
            {children}
            <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#333",
              color: "#fff",
            },
            success: {
              iconTheme: {
                primary: "#4ade80",
                secondary: "#333",
              },
            },
          }}
        />
          </main>

          {/* Footer sticks to the bottom naturally */}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
