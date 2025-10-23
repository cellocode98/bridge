/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import FeaturedCarousel from "@/components/FeaturedCarousel";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/components/AuthProvider";
import toast from "react-hot-toast";

interface Opportunity {
  id: string;
  title: string;
  organization: string;
  description: string;
  featured: boolean;
  tags?: string[];
}

export default function OpportunitiesPage() {
  const [allOpportunities, setAllOpportunities] = useState<Opportunity[]>([]);
  const [featuredOpportunities, setFeaturedOpportunities] = useState<Opportunity[]>([]);
  const [appliedIds, setAppliedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [visibleCount, setVisibleCount] = useState(6);

  const { profile } = useAuth();

useEffect(() => {
    fetchOpportunities();
    if (profile) fetchUserApplications();
  }, [profile]);

  const fetchOpportunities = async () => {
    const { data, error } = await supabase.from("opportunities").select("*");
    if (error) toast.error("Failed to load opportunities");
    else {setAllOpportunities(data || []) 
      setFeaturedOpportunities(data.filter((opp: any) => opp.featured)); 
      }
  };

  const fetchUserApplications = async () => {
    const { data, error } = await supabase
      .from("user_applications")
      .select("opportunity_id")
      .eq("user_id", profile?.id);

    if (error) toast.error("Failed to load your applications");
    else setAppliedIds(data.map((item) => item.opportunity_id));
  };

  const handleApply = async (opportunityId: string) => {
    if (!profile) {
      toast.error("You must be signed in to apply.");
      return;
    }

    const { data: existing } = await supabase
      .from("user_applications")
      .select("id")
      .eq("user_id", profile.id)
      .eq("opportunity_id", opportunityId)
      .maybeSingle();

    if (existing) {
      toast("You’ve already signed up for this opportunity.");
      return;
    }

    const { error } = await supabase.from("user_applications").insert([
      {
        user_id: profile.id,
        opportunity_id: opportunityId,
        status: "pending",
        applied_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      toast.error("Something went wrong. Please try again.");
    } else {
      setAppliedIds((prev) => [...prev, opportunityId]);
      toast.success("Successfully signed up! ✅");
    }
  };

  // Handle infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 &&
        visibleCount < filteredOpportunities.length
      ) {
        setVisibleCount((prev) => prev + 6);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [visibleCount, allOpportunities, selectedFilter, searchQuery]);

  const filters = ["All", "STEM", "Community", "Arts", "High Impact"];

  const filteredOpportunities = allOpportunities.filter((opp) => {
    const matchesSearch =
      opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.organization.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      selectedFilter === "all" || (opp.tags && opp.tags.includes(selectedFilter));
    return matchesSearch && matchesFilter;
  });

  return (
    <main className="pt-20 min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      {/* Hero Section */}
      <section className="relative mb-12">
        {/* Floating blobs */}
        <div className="absolute -top-32 -left-32 w-72 h-72 bg-pink-300/30 rounded-full filter blur-3xl animate-[blob_8s_infinite]"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-300/20 rounded-full filter blur-3xl animate-[blob2_12s_infinite]"></div>

        <h1 className="text-5xl font-extrabold text-gray-900 mb-4">Discover Opportunities</h1>
        <p className="text-gray-700 text-lg max-w-2xl">
          Connect with impactful volunteer opportunities and make a difference.
        </p>
      </section>

      {/* Featured Carousel */}
      {featuredOpportunities.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Featured</h2>
          <FeaturedCarousel featured={featuredOpportunities} />
        </section>
      )}

      {/* Search + Filter */}
      <section className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <input
          type="text"
          placeholder="Search opportunities..."
          className="flex-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="flex gap-2 flex-wrap">
          {filters.map((filter) => (
            <button
              key={filter}
              className={`px-4 py-2 rounded-lg border ${
                selectedFilter === filter
                  ? "bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white border-none"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              } transition`}
              onClick={() => setSelectedFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
      </section>

      {/* All Opportunities - Infinite Fade-In Scroll */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          {filteredOpportunities.length === 0 ? "No opportunities found" : "All Opportunities"}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOpportunities.slice(0, visibleCount).map((opp, index) => (
            <motion.div
              key={opp.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`p-6 rounded-xl shadow-md flex flex-col justify-between cursor-pointer transition-transform duration-300 hover:scale-105 hover:shadow-xl ${
                opp.featured
                  ? "bg-gradient-to-br from-purple-100 via-pink-100 to-red-100 border-2 border-purple-400"
                  : "bg-white border border-gray-200"
              }`}
            >
              <div>
                <p className="font-bold text-xl text-gray-800">{opp.title}</p>
                <p className="text-gray-700 text-sm mt-1">{opp.organization}</p>
                <p className="text-gray-700 text-sm mt-2 line-clamp-4">{opp.description}</p>
                {opp.tags && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {opp.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs font-medium px-2 py-1 bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 text-purple-800 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <button
                className="mt-4 px-4 py-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-lg hover:opacity-90 transition"
                onClick={() => handleApply(opp.id)}
              >
                Apply
              </button>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
}



