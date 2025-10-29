"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useAnimationFrame } from "framer-motion";

interface Opportunity {
  id: string;
  title: string;
  organization: string;
  description: string;
  tags?: string[];
  featured: boolean;
}

interface FeaturedCarouselProps {
  featured: Opportunity[];
}

export default function FeaturedCarousel({ featured }: FeaturedCarouselProps) {
  const x = useMotionValue(0);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [singleSetWidth, setSingleSetWidth] = useState(0);

  const speed = 50; // pixels per second

  // repeat items 3 times for smooth infinite scroll
  const repeatedItems = Array(3)
    .fill(null)
    .flatMap(() => featured);

  // measure the width of a single set of items
  useEffect(() => {
    if (containerRef.current) {
      setSingleSetWidth(containerRef.current.scrollWidth / 3);
    }
  }, [featured]);

  // infinite scroll using x.get() (ts-safe)
  useAnimationFrame((t, delta) => {
    if (!isPaused && singleSetWidth > 0) {
      const current = x.get() as number;
      let next = current - (speed * delta) / 1000;
      if (Math.abs(next) >= singleSetWidth) next += singleSetWidth;
      x.set(next);
    }
  });

  return (
    <div
        className="relative overflow-hidden cursor-pointer"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <motion.div ref={containerRef} className="flex gap-6" style={{ x }}>
          {repeatedItems.map((opp, idx) => (
            <div
              key={`${opp.id}-${idx}`}
              className="min-w-[300px] p-6 rounded-xl shadow-sm flex flex-col justify-between transition-transform duration-300 hover:scale-105 hover:shadow-md bg-white border border-gray-200"
            >
              {/* Featured tag inline */}
              {opp.featured && (
                <span className="self-start px-2 py-1 text-xs font-bold bg-indigo-600 text-white rounded-full mb-2">
                  FEATURED
                </span>
              )}

              <h3 className="font-semibold text-lg text-gray-800">{opp.title}</h3>
              <p className="text-gray-600 text-sm mt-1">{opp.organization}</p>
              <p className="text-gray-700 text-sm mt-2 line-clamp-3 leading-relaxed">{opp.description}</p>

              {opp.tags && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {opp.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-medium px-2 py-1 rounded-md bg-gray-100 text-gray-700 border border-gray-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </motion.div>
      </div>
  );
}








