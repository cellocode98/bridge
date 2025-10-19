"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col items-center justify-center text-center px-4">
      {/* TEMP: Tailwind visual test banner - remove after checking */}
      {/* Hero Text */}
      <motion.h1
        className="text-5xl font-bold text-gray-900 mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Bridge
      </motion.h1>
      <motion.p
        className="text-lg text-gray-600 max-w-2xl mb-8"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        Connecting students with meaningful volunteer opportunities.  
        Build real impact, one opportunity at a time.
      </motion.p>

      {/* CTA Buttons */}
      <motion.div
        className="flex flex-col sm:flex-row gap-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Link
          href="/opportunities"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
        >
          Browse Opportunities
        </Link>
        <Link
          href="/profile"
          className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition"
        >
          My Profile
        </Link>
      </motion.div>

      {/* Optional Tagline */}
      <motion.div
        className="mt-10 text-sm text-gray-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.8 }}
      >
        Made for students. Powered by community.
      </motion.div>
    </div>
  );
}
