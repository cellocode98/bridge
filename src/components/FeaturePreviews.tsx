"use client";

import { motion } from "framer-motion";

export default function FeaturePreviews() {
  const features = [
    {
      title: "Personalized Opportunities",
      description:
        "Quickly find programs and scholarships that match your goals, curated just for you.",
      animation: (
        <div className="flex gap-2">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="w-12 h-16 bg-blue-400 rounded-lg"
              animate={{ x: [0, 10, 0], opacity: [0.8, 1, 0.8] }}
              transition={{ repeat: Infinity, duration: 1 + i * 0.3 }}
            />
          ))}
        </div>
      ),
    },
    {
      title: "Community Driven",
      description:
        "Chat, collaborate, and grow with other students and mentors in real time.",
      animation: (
        <div className="flex flex-col gap-2">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className={`self-${i % 2 === 0 ? "start" : "end"} bg-pink-400 text-white px-3 py-1 rounded-full max-w-[70%]`}
              animate={{ y: [0, -5, 0], opacity: [0.8, 1, 0.8] }}
              transition={{ repeat: Infinity, duration: 1 + i * 0.4 }}
            >
              Hello!
            </motion.div>
          ))}
        </div>
      ),
    },
    {
      title: "Planned Features",
      description:
        "See what’s coming soon and how Bridge is evolving with new tools and opportunities.",
      animation: (
        <div className="flex gap-3">
          {["🛠️", "📅", "🚀"].map((icon, i) => (
            <motion.div
              key={i}
              className="text-2xl"
              animate={{ y: [0, -10, 0], rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 1 + i * 0.5, ease: "easeInOut" }}
            >
              {icon}
            </motion.div>
          ))}
        </div>
      ),
    },
  ];

  return (
    <section className="relative flex flex-col items-center justify-center gap-40 px-6 py-40">
      {/* Floating blobs behind features */}
      {features.map((_, idx) => (
        <motion.div
          key={idx}
          className={`absolute w-56 h-56 rounded-full opacity-20 blur-3xl ${
            idx % 2 === 0 ? "bg-purple-200 left-[-100px]" : "bg-pink-200 right-[-100px]"
          }`}
          style={{ top: `${idx * 300}px` }}
          animate={{ y: [0, 20, 0], x: [0, 15, 0] }}
          transition={{ repeat: Infinity, duration: 12 + idx * 2, ease: "easeInOut" }}
        />
      ))}

      <h2 className="text-4xl font-bold text-blue-600 mb-20 z-10">Explore Bridge Features</h2>

      {features.map((feature, idx) => (
        <motion.div
          key={feature.title}
          className={`flex flex-col md:flex-row items-center gap-16 w-full max-w-4xl z-10 ${
            idx % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
          }`}
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Animation Box */}
          <div className="flex-shrink-0">{feature.animation}</div>

          {/* Text Description */}
          <div className="max-w-md">
            <h3 className="text-2xl font-semibold text-blue-600 mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        </motion.div>
      ))}
    </section>
  );
}
