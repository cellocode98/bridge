"use client";
import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/components/AuthProvider";
import { motion, Variants, easeOut } from "framer-motion";

interface LeaderboardEntry {
  id: string;
  full_name: string;
  totalHours: number;
  impactScore: number;
  rank?: number;
}

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOut } },
};

export default function LeaderboardPage() {
  const { profile, loading } = useAuth();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [filter, setFilter] = useState<"week" | "month" | "all">("all");
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(false);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoadingLeaderboard(true);
      try {
        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        // fetch all completed user_applications with associated opportunity info
        const { data: userApps, error } = await supabase
          .from("user_applications")
          .select(`
            user: user_id (id, name),
            opportunity: opportunity_id (id, title, hours, featured, date),
            status,
            applied_at
          `)
          .eq("status", "Completed");

        if (error) throw error;

        // map users to total hours and impact score
        const leaderboardMap: Record<string, LeaderboardEntry> = {};

        (userApps || []).forEach((app: any) => {
          const userId = app.user.id;
          const userName = app.user.full_name;
          const opp = app.opportunity;
          const appliedDate = new Date(app.applied_at || opp.date);

          // filter 
          if (
            (filter === "week" && appliedDate < startOfWeek) ||
            (filter === "month" && appliedDate < startOfMonth)
          )
            return;

          const hours = opp.hours || 2;
          const impact = opp.featured ? hours * 1.5 : hours;

          if (!leaderboardMap[userId]) {
            leaderboardMap[userId] = {
              id: userId,
              full_name: userName,
              totalHours: hours,
              impactScore: impact,
            };
          } else {
            leaderboardMap[userId].totalHours += hours;
            leaderboardMap[userId].impactScore += impact;
          }
        });

        // sort lb
        const leaderboard = Object.values(leaderboardMap)
          .sort((a, b) => b.impactScore - a.impactScore)
          .map((entry, index) => ({ ...entry, rank: index + 1 }));

        setEntries(leaderboard);

        if (profile) {
          const myRank = leaderboard.findIndex((e) => e.id === profile.id);
          setUserRank(myRank >= 0 ? myRank + 1 : null);
        }
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
      } finally {
        setLoadingLeaderboard(false);
      }
    };

    fetchLeaderboard();
  }, [filter, profile]);

  if (loading || loadingLeaderboard)
    return <p className="text-center mt-20 text-gray-500">Loading leaderboard...</p>;
  if (!profile) return <p className="text-center mt-20 text-gray-500">Please sign in.</p>;

  const top3 = entries.slice(0, 3);
  const rest = entries.slice(3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8 md:p-12 text-gray-700">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 pt-20">Leaderboard</h1>
        <div className="flex gap-2">
          <button
            className={`px-4 py-2 rounded-full ${
              filter === "week" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"
            }`}
            onClick={() => setFilter("week")}
          >
            This Week
          </button>
          <button
            className={`px-4 py-2 rounded-full ${
              filter === "month" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"
            }`}
            onClick={() => setFilter("month")}
          >
            This Month
          </button>
          <button
            className={`px-4 py-2 rounded-full ${
              filter === "all" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"
            }`}
            onClick={() => setFilter("all")}
          >
            All Time
          </button>
        </div>
      </div>

      {/* Top 3 cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {top3.map((entry, idx) => {
            const isUser = entry.id === profile?.id;
            return (
            <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-6 bg-white rounded-3xl shadow-xl flex flex-col items-center gap-3 ${
                isUser ? "ring-4 ring-blue-500" : ""
                }`}
            >
                <div className="text-4xl">{["🥇", "🥈", "🥉"][idx]}</div>
                <h2 className="text-xl font-bold text-gray-900">
                {profile.name} {isUser && <span className="text-blue-600">(You)</span>}
                </h2>
                <p className="text-gray-600">Impact Score: {entry.impactScore}</p>
                <p className="text-gray-400 text-sm">Total Hours: {entry.totalHours}</p>
            </motion.div>
            );
        })}
        </div>

      {/* Table for remaining users */}
      <div className="overflow-x-auto bg-white/20 backdrop-blur-lg border border-white/30 rounded-3xl p-6 shadow-lg">
        <table className="w-full text-left table-auto">
          <thead>
            <tr className="text-gray-700 border-b border-gray-300">
              <th className="py-2 px-4">Rank</th>
              <th className="py-2 px-4">Name</th>
              <th className="py-2 px-4">Total Hours</th>
              <th className="py-2 px-4">Impact Score</th>
            </tr>
          </thead>
          <tbody>
            {rest.map((entry) => (
              <tr
                key={entry.id}
                className={`border-b border-gray-200 ${
                  entry.id === profile.id ? "bg-blue-50" : ""
                }`}
              >
                <td className="py-2 px-4">{entry.rank}</td>
                <td className="py-2 px-4">{entry.full_name}</td>
                <td className="py-2 px-4">{entry.totalHours}</td>
                <td className="py-2 px-4">{entry.impactScore}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
