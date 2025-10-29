"use client";

import { motion } from "framer-motion";

export default function FeaturePreviews() {
  return (
    <section className="relative py-32 bg-white text-gray-800 overflow-hidden">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
        className="text-center mb-16 px-6"
      >
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-purple-600">
          Features That Empower You
        </h2>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
          Everything you need to connect, collaborate, and make an impact.
        </p>
      </motion.div>

      {/* Feature Cards */}
      <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 px-8 h-100 md:px-16 lg:px-24 z-10">
        {[
          {
            title: "Smart Matching",
            desc: "Filter through opportunities that align with your skills and interests.",
            icon: "🔍",
            gradient: "from-blue-500 to-purple-500",
          },
          {
            title: "Impact Tracking",
            desc: "Visualize your growth and community contributions with progress insights.",
            icon: "📊",
            gradient: "from-green-500 to-blue-500",
          },
          {
            title: "Community Driven",
            desc: "Join a thriving community of changemakers and amplify your impact together.",
            icon: "🤝",
            gradient: "from-orange-500 to-pink-500",
          },
          {
            title: "Seamless Experience",
            desc: "Enjoy an intuitive, fast, friendly platform built for accessibility and ease.",
            icon: "⚡",
            gradient: "from-yellow-500 to-purple-500",
          },
        ].map((feature, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1, duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
            whileHover={{
              y: -8,
              scale: 1.03,
              boxShadow:
                "0 10px 25px rgba(59, 130, 246, 0.15), 0 4px 10px rgba(0,0,0,0.05)",
            }}
            className="group relative bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all border border-gray-100"
          >
            <div
              className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-10 rounded-2xl blur-xl group-hover:opacity-20 transition`}
            />
            <div className="relative z-10 flex flex-col items-start">
              <div
                className={`text-4xl mb-5 bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent`}
              >
                {feature.icon}
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-gray-900">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Floating Accent Blobs */}
      <motion.div
        className="absolute top-0 left-[-100px] w-80 h-80 bg-blue-300/20 rounded-full blur-3xl"
        animate={{ y: [0, 20, 0], rotate: [0, 10, -10, 0] }}
        transition={{ repeat: Infinity, duration: 14, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[-100px] right-[-100px] w-96 h-96 bg-purple-300/20 rounded-full blur-3xl"
        animate={{ y: [0, -20, 0], rotate: [0, -15, 15, 0] }}
        transition={{ repeat: Infinity, duration: 18, ease: "easeInOut" }}
      />
    </section>
  );
}
