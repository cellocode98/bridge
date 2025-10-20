"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import FeaturePreviews from "../src/components/FeaturePreviews";

export default function LandingPage() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 800], [0, 100]);
  const y2 = useTransform(scrollY, [0, 800], [0, -100]);

  return (
    <main className="relative bg-gradient-to-b from-blue-50 to-white text-gray-800 overflow-x-hidden">
      {/* Blobs Container */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          style={{ y: y1 }}
          className="absolute top-[-50px] left-[-100px] w-[400px] h-[400px] bg-blue-300 opacity-30 rounded-full blur-3xl"
          animate={{
            rotate: [0, 10, -10, 0],
            scale: [1, 1.05, 0.95, 1],
            opacity: [0.25, 0.35, 0.25],
          }}
          transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
        />
        <motion.div
          style={{ y: y2 }}
          className="absolute top-[350px] right-[-100px] w-[350px] h-[350px] bg-green-300 opacity-30 rounded-full blur-3xl"
          animate={{
            rotate: [0, -15, 15, 0],
            scale: [1, 1.03, 0.97, 1],
            opacity: [0.25, 0.35, 0.25],
          }}
          transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
        />
        <motion.div
          style={{ y: y1 }}
          className="absolute bottom-[-50px] left-[15%] w-[450px] h-[450px] bg-purple-300 opacity-30 rounded-full blur-3xl"
          animate={{
            rotate: [0, 20, -20, 0],
            scale: [1, 1.06, 0.94, 1],
            opacity: [0.25, 0.35, 0.25],
          }}
          transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
        />
      </div>

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col justify-center items-center text-center px-6 relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-[clamp(3rem,10vw,8rem)] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 drop-shadow-lg mb-6 whitespace-nowrap"
        >
          Bridge
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
          className="text-xl max-w-2xl mb-10 text-gray-700"
        >
          Connect with meaningful opportunities, build real impact, and grow
          your skills — all in one place.
        </motion.p>

        <motion.div whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.95 }}>
          <Link
            href="/auth"
            className="bg-blue-600 text-white px-10 py-3 rounded-full font-semibold shadow-lg hover:bg-blue-700 transition"
          >
            Get Started
          </Link>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-10 flex flex-col items-center gap-1 text-blue-600"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
          <span className="text-sm">Scroll</span>
        </motion.div>
      </section>

      {/* Features Section */}
      <FeaturePreviews />

<section className="relative min-h-[50vh] flex flex-col justify-center items-center text-center px-6 py-24 md:py-32 bg-gradient-to-br from-blue-600 to-purple-600 text-white overflow-hidden">
  {/* Floating blobs */}
  <motion.div
    className="absolute top-[-50px] left-[-50px] w-72 h-72 bg-purple-300 rounded-full opacity-30 blur-3xl"
    animate={{ y: [0, 20, 0], x: [0, 15, 0] }}
    transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
  />
  <motion.div
    className="absolute bottom-[-60px] right-[-60px] w-60 h-60 bg-pink-300 rounded-full opacity-30 blur-3xl"
    animate={{ y: [0, -20, 0], x: [0, -15, 0] }}
    transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
  />

  {/* CTA Content */}
  <motion.h2
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, ease: "easeOut" }}
    viewport={{ once: true, amount: 0.25 }}
    className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight md:leading-snug bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200"
  >
    Ready to Bridge the Gap?
  </motion.h2>

  <motion.p
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
    viewport={{ once: true, amount: 0.25 }}
    className="text-lg md:text-xl mb-8 max-w-md"
  >
    Be part of something big. Sign up today to shape your journey.
  </motion.p>

  <motion.div
    whileHover={{ scale: 1.08 }}
    whileTap={{ scale: 0.95 }}
    className="z-10"
  >
    <Link
      href="/auth"
      className="bg-white text-blue-600 px-12 py-4 rounded-full font-semibold shadow-xl hover:bg-blue-100 transition-all duration-300"
    >
      Join Bridge
    </Link>
  </motion.div>
</section>
    </main>
  );
}
