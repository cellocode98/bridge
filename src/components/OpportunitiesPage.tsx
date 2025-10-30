/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import FeaturedCarousel from "@/components/FeaturedCarousel";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/components/AuthProvider";
import toast from "react-hot-toast";
import Chatbot from "./Chatbot";

interface Opportunity {
  id: string;
  title: string;
  organization: string;
  description: string;
  featured: boolean;
  tags?: string[];
  latitude?: number;
  longitude?: number;
  distanceMiles?: number;
  date?: string;
}

export default function OpportunitiesPage() {
  const [allOpportunities, setAllOpportunities] = useState<Opportunity[]>([]);
  const [featuredOpportunities, setFeaturedOpportunities] = useState<Opportunity[]>([]);
  const [appliedIds, setAppliedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [visibleCount, setVisibleCount] = useState(6);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const { profile } = useAuth();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
        },
        (err) => console.error("Location error:", err),
        { enableHighAccuracy: true }
      );
    }
  }, []);

  useEffect(() => {
    fetchOpportunities();
    if (profile) fetchUserApplications();
  }, [profile]);

  const fetchOpportunities = async () => {
    const { data, error } = await supabase.from("opportunities").select("*");
    if (error) toast.error("Failed to load opportunities");
    else {
      setAllOpportunities(data || []);
      setFeaturedOpportunities(data?.filter((opp: any) => opp.featured) || []);
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
    if (!profile) return toast.error("You must be signed in to apply.");

    const { data: existing } = await supabase
      .from("user_applications")
      .select("id")
      .eq("user_id", profile.id)
      .eq("opportunity_id", opportunityId)
      .maybeSingle();

    if (existing) return toast("You’ve already signed up for this opportunity.");

    const { error } = await supabase.from("user_applications").insert([
      {
        user_id: profile.id,
        opportunity_id: opportunityId,
        status: "Upcoming",
        applied_at: new Date().toISOString(),
      },
    ]);

    if (error) toast.error("Something went wrong. Please try again.");
    else {
      setAppliedIds((prev) => [...prev, opportunityId]);
      toast.success("Successfully signed up! ✅");
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 &&
        visibleCount < filteredOpportunities.length
      )
        setVisibleCount((prev) => prev + 6);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [visibleCount, allOpportunities, selectedFilter, searchQuery]);

  const getDistanceFromLatLonInMiles = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 3958.8;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const filteredOpportunities = allOpportunities
    .map((opp) => {
      let distanceMiles: number | undefined = undefined;
      if (userLocation && opp.latitude && opp.longitude)
        distanceMiles = getDistanceFromLatLonInMiles(
          userLocation.lat,
          userLocation.lng,
          Number(opp.latitude),
          Number(opp.longitude)
        );
      return { ...opp, distanceMiles };
    })
    .filter((opp) => {
      const matchesSearch =
        opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opp.organization.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter =
        selectedFilter === "all" || (opp.tags && opp.tags.includes(selectedFilter));
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (a.distanceMiles === undefined) return 1;
      if (b.distanceMiles === undefined) return -1;
      return a.distanceMiles - b.distanceMiles;
    });

  return (
    <main className="pt-20 min-h-screen bg-gray-50 text-gray-900 p-6">
      {/* Hero Section */}
      <section className="relative mb-12 text-center">
        <h1 className="text-5xl font-extrabold tracking-tight mb-3">Discover Opportunities</h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Connect with impactful volunteer opportunities and make a difference.
        </p>
      </section>

      {/* Featured Carousel */}
      {featuredOpportunities.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-gray-800 mb-5">Featured Opportunities</h2>
          <div className="rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition">
            <FeaturedCarousel featured={featuredOpportunities} />
          </div>
        </section>
      )}

      {/* Search */}
      <section className="mb-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <input
          type="text"
          placeholder="Search opportunities..."
          className="flex-1 p-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-300 transition"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </section>

      {/* Opportunities Grid */}
      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-5">
          {filteredOpportunities.length === 0 ? "No opportunities found" : "All Opportunities"}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOpportunities.slice(0, visibleCount).map((opp, index) => (
            <motion.div
              key={opp.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="p-6 rounded-xl flex flex-col justify-between border bg-white shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <div>
                <h3 className="font-semibold text-lg">{opp.title}</h3>
                <p className="text-sm mt-1 text-gray-600">
                  {opp.organization}
                  {opp.distanceMiles !== undefined && (
                    <span className="text-gray-500"> • {opp.distanceMiles.toFixed(1)} mi away</span>
                  )}
                </p>
                <p className="text-gray-700 text-sm mt-3 line-clamp-4 leading-relaxed">{opp.description}</p>
                {opp.date && (
                <p className="text-gray-500 text-sm mt-1">
                  {(() => {
                    const [year, month, day] = opp.date.slice(0, 10).split("-").map(Number);
                    const localDate = new Date(year, month - 1, day);
                    return localDate.toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  })()}
                </p>
                  )}
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
              <button
                className="mt-5 px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium shadow-sm hover:bg-indigo-700 hover:shadow-md transition"
                onClick={() => handleApply(opp.id)}
              >
                Apply
              </button>
            </motion.div>
          ))}
        </div>
      </section>
      <Chatbot/>
    </main>
  );
}
