"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import FeaturePreviews from "../src/components/FeaturePreviews";
import Head from "next/head";

export default function LandingPage() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 800], [0, 120]);
  const y2 = useTransform(scrollY, [0, 800], [0, -120]);

  return (
    <>
      <Head>
        <title>Bridge — Connect. Build. Grow.</title>
        <meta
          name="description"
          content="Bridge helps you connect with meaningful opportunities, build impact, and grow your skills — all in one place."
        />
      </Head>

      <main className="relative bg-gradient-to-b from-blue-50 to-white text-gray-800 overflow-x-hidden">

        {/* Background Blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            style={{ y: y1 }}
            className="absolute top-[-80px] left-[-120px] w-[450px] h-[450px] bg-blue-400/30 rounded-full blur-3xl"
            animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.05, 0.95, 1] }}
            transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
          />
          <motion.div
            style={{ y: y2 }}
            className="absolute top-[400px] right-[-120px] w-[400px] h-[400px] bg-indigo-300/30 rounded-full blur-3xl"
            animate={{ rotate: [0, -20, 20, 0], scale: [1, 1.06, 0.94, 1] }}
            transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
          />
          <motion.div
            style={{ y: y1 }}
            className="absolute bottom-[-60px] left-[10%] w-[500px] h-[500px] bg-purple-300/25 rounded-full blur-3xl"
            animate={{ rotate: [0, 25, -25, 0], scale: [1, 1.07, 0.93, 1] }}
            transition={{ repeat: Infinity, duration: 14, ease: "easeInOut" }}
          />
        </div>

        {/* Hero Section */}
        <section className="min-h-screen flex flex-col justify-center items-center text-center px-6 relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-[clamp(3rem,9vw,7rem)] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-purple-600 to-pink-600 drop-shadow-xl leading-tight mb-6"
          >
            Bridge
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            className="text-lg md:text-xl max-w-2xl mb-10 text-gray-700 leading-relaxed"
          >
            Connect with meaningful opportunities, build real impact, and grow
            your skills — all in one place.
          </motion.p>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/auth"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
            >
              Get Started
            </Link>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            className="absolute bottom-10 flex flex-col items-center gap-1 text-blue-600/80"
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
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
            <span className="text-sm font-medium">Scroll</span>
          </motion.div>
        </section>

        {/* Features */}
        <FeaturePreviews />

        {/* CTA Section */}
        <section className="relative min-h-[60vh] flex flex-col justify-center items-center text-center px-6 py-28 md:py-36 bg-gradient-to-br from-blue-700 via-purple-700 to-pink-600 text-white overflow-hidden">
          <motion.div
            className="absolute top-[-50px] left-[-50px] w-80 h-80 bg-purple-300/20 rounded-full blur-3xl"
            animate={{ y: [0, 25, 0], x: [0, 20, 0] }}
            transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-[-60px] right-[-60px] w-72 h-72 bg-pink-300/25 rounded-full blur-3xl"
            animate={{ y: [0, -25, 0], x: [0, -20, 0] }}
            transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
          />

          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-white"
          >
            Ready to Bridge the Gap?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            viewport={{ once: true }}
            className="text-lg md:text-xl mb-10 max-w-lg opacity-90"
          >
            Be part of something big. Sign up today to shape your journey.
          </motion.p>

          <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/auth"
              className="backdrop-blur-md bg-white/90 text-blue-700 px-12 py-4 rounded-full font-semibold shadow-xl hover:bg-white transition-all duration-300 border border-white/30"
            >
              Join Bridge
            </Link>
          </motion.div>
        </section>
      </main>
    </>
  );
}
