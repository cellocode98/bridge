"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-r from-blue-50 to-blue-100 text-gray-700 py-10 px-6 mt-16 overflow-hidden">
      {/* Floating blobs for playful touch */}
      <motion.div
        className="absolute top-[-40px] left-[-60px] w-40 h-40 bg-purple-200 rounded-full opacity-20 blur-2xl"
        animate={{ y: [0, 15, 0], x: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[-50px] right-[-50px] w-36 h-36 bg-pink-200 rounded-full opacity-20 blur-2xl"
        animate={{ y: [0, -15, 0], x: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 14, ease: "easeInOut" }}
      />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto gap-4 md:gap-0">
        {/* Branding */}
        <span className="text-lg font-semibold">© 2025 Bridge. All rights reserved.</span>

        {/* Links */}
        <div className="flex gap-6 text-blue-600 font-medium">
          <Link href="/privacy" className="hover:underline">
            Privacy
          </Link>
          <Link href="/terms" className="hover:underline">
            Terms
          </Link>
          <Link href="/contact" className="hover:underline">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}
