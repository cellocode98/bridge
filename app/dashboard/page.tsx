/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import UserHero from "@/components/UserHero";
import { supabase } from "@/lib/supabaseClient";
import OpportunityCard from "@/components/OpportunityCard";
import HoursPieChart from "@/components/PieChart";
import VolunteerCalendar from "@/components/VolunteerCalendar";
import { motion, Variants, easeOut } from "framer-motion";
import ImpactScore from "@/components/ImpactScore";
import Chatbot from "@/components/Chatbot";

interface Opportunity {
  id: string;
  title: string;
  organization: string;
  date: string;
  cause: string;
  hours: number;
  status: string;
  applied_at: string;
  proofs?: { id: string; verified: boolean }[];
  hasProof?: boolean;
  proofVerified?: boolean;
}

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOut } },
};

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } },
};

const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

export default function DashboardPage() {
  const { profile, loading } = useAuth();
  const [applications, setApplications] = useState<Opportunity[]>([]);
  const [showCompletedOnly, setShowCompletedOnly] = useState(false);
  const [showPendingOnly, setShowPendingOnly] = useState(false);
  const [showUpcomingOnly, setShowUpcomingOnly] = useState(false);


  const totalApplied = applications.length;
  const completed = applications.filter((a) => a.status === "Completed").length;
  const pending = applications.filter((a) => a.status === "Pending").length;
  const upcoming = applications.filter((a) => a.status === "Upcoming").length;
  const totalHours = applications.reduce((sum, a) => sum + a.hours, 0);

useEffect(() => {
  if (!profile) return;

  const fetchUserApplications = async () => {
    try {
      const { data, error } = await supabase
        .from("user_applications")
        .select(`
          status,
          applied_at,
          opportunity:opportunity_id (
            id,
            title,
            organization,
            category,
            date,
            hours,
            proofs:proofs!fk_proofs_opportunity (id, image_url, note, verified, created_at)
          )
        `)
        .eq("user_id", profile.id);

      if (error) throw error;

      const today = new Date();
      today.setHours(0, 0, 0, 0); // local midnight

      const parseLocalDate = (dateString: string) => {
        const [year, month, day] = dateString.slice(0, 10).split("-").map(Number);
        return new Date(year, month - 1, day); // local midnight
      };

      const userOpportunities = (data || []).map((item: any) => {
        const proofs = item.opportunity.proofs || [];
        const proofVerified = proofs.some(
          (p: any) => p.verified === true || p.verified === "true"
        );

        const oppDate = parseLocalDate(item.opportunity.date);

        // Determine dynamic status
        let derivedStatus = item.status;
        if (proofVerified || item.status === "Completed") {
          derivedStatus = "Completed";
        } else if (oppDate < today) {
          derivedStatus = "Pending";
        } else {
          derivedStatus = "Upcoming";
        }

        return {
          id: item.opportunity.id,
          title: item.opportunity.title,
          organization: item.opportunity.organization,
          date: item.opportunity.date,
          cause: item.opportunity.category,
          hours: item.opportunity.hours,
          status: derivedStatus,
          applied_at: item.applied_at,
          proofs,
          hasProof: proofs.length > 0,
          proofVerified,
          isCompleted: derivedStatus === "Completed",
        };
      });

      setApplications(userOpportunities);
    } catch (err) {
      console.error("Error fetching user applications:", err);
    }
  };

  fetchUserApplications();
}, [profile]);




  if (loading) return <p className="text-center mt-20 text-gray-500">Loading...</p>;
  if (!profile) return <p className="text-center mt-20 text-gray-500">Please sign in.</p>;

  const now = new Date();

  const visibleApplications = applications.filter((a) => {
    if (showPendingOnly) return a.status === "Pending";
    if (showUpcomingOnly)
      return a.status !== "Completed" && new Date(a.date) > now;
    if (showCompletedOnly) return a.status === "Completed";
    return true; // show all if no filter active
  });

  const pieData = ["Environment", "Community", "Education"].map((category) => {
  const total = applications
    .filter((app) => app.status === "Completed" && app.cause === category)
    .reduce((sum, app) => sum + (app.hours || 0), 0);
  return { cause: category, hours: total };
  });



  return (
    <div data-page-title="Dashboard">
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8 md:p-12"
      >
        {/* Hero Section */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="flex flex-col md:flex-row items-start gap-8 mb-10"
        >
          <div className="flex-1 p-8 bg-white/20 backdrop-blur-lg border border-white/30 rounded-3xl shadow-2xl">
            <UserHero subtitle="Here's a snapshot of your volunteer activity." />
          </div>
        </motion.div>

        {/* Dashboard Container */}
        <div className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-3xl shadow-2xl p-8 flex flex-col gap-10">
          <div className="flex flex-col md:flex-row items-start gap-6 overflow-hidden">
            {/* Cards Row */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="flex gap-6 flex-nowrap overflow-x-auto pb-2"
            >
              {/* Stats Card */}
              <motion.div variants={fadeInUp} className="w-full md:w-80 p-6 bg-blue-50 backdrop-blur-lg border border-white/30 rounded-3xl flex flex-col gap-4 flex-shrink-0">
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Your Stats</h3>
                <div className="flex justify-between items-center p-3 bg-white/60 rounded-xl">
                  <p className="text-gray-700 font-medium">Total Opportunities</p>
                  <p className="font-bold text-gray-900">{totalApplied}</p>
                </div>
                <div className="flex justify-between items-center p-3 bg-yellow-100 rounded-xl">
                  <p className="text-gray-700 font-medium">Upcoming</p>
                  <p className="font-bold text-yellow-800">{upcoming}</p>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-100 rounded-xl">
                  <p className="text-gray-700 font-medium">Completed</p>
                  <p className="font-bold text-green-800">{completed}</p>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-100 rounded-xl">
                  <p className="text-gray-700 font-medium">Total Hours</p>
                  <p className="font-bold text-blue-800">{totalHours}</p>
                </div>
              </motion.div>

              {/* Hours Pie Chart */}
              <motion.div
                variants={fadeInUp}
                className="w-96 p-5 bg-blue-50 backdrop-blur-lg border border-white/30 rounded-3xl flex flex-col gap-4 flex-shrink-0"
              >
                <h3 className="text-lg font-semibold text-gray-800">Completed Hours by Cause</h3>
                <HoursPieChart data={pieData} />
              </motion.div>

              {/* Impact Score */}
              <motion.div variants={fadeInUp} className="w-96 p-5 bg-blue-50 backdrop-blur-lg border border-white/30 rounded-3xl flex flex-col gap-4 flex-shrink-0">
                <h3 className="text-lg font-semibold text-gray-800">Impact Score</h3>
                <ImpactScore />
              </motion.div>

              {/* Volunteer Calendar */}
              <motion.div variants={fadeInUp} className="w-96 p-5 bg-blue-50 backdrop-blur-lg border border-white/30 rounded-3xl flex flex-col gap-4 flex-shrink-0">
                <h3 className="text-lg font-semibold text-gray-800">Volunteer Calendar</h3>
                <VolunteerCalendar opportunities={applications} />
              </motion.div>
            </motion.div>
          </div>

          {/* My Opportunities Section */}
          <div className="pt-4 border-t border-white/30">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">My Opportunities</h2>

              <div className="flex gap-3">
                {/* Pending Filter */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setShowPendingOnly(!showPendingOnly);
                    setShowUpcomingOnly(false);
                    setShowCompletedOnly(false);
                  }}
                  className={`px-5 py-2 rounded-full font-medium shadow transition ${
                    showPendingOnly
                      ? "bg-orange-500 text-white hover:bg-orange-600"
                      : "bg-orange-100 text-orange-800 hover:bg-orange-200"
                  }`}
                >
                  {showPendingOnly ? "Show All" : "Show Pending Only"}
                </motion.button>

                {/* Upcoming Filter */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setShowUpcomingOnly(!showUpcomingOnly);
                    setShowPendingOnly(false);
                    setShowCompletedOnly(false);
                  }}
                  className={`px-5 py-2 rounded-full font-medium shadow transition ${
                    showUpcomingOnly
                      ? "bg-blue-500 text-white hover:bg-blue-600"
                      : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                  }`}
                >
                  {showUpcomingOnly ? "Show All" : "Show Upcoming Only"}
                </motion.button>

                {/* Completed Filter */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setShowCompletedOnly(!showCompletedOnly);
                    setShowPendingOnly(false);
                    setShowUpcomingOnly(false);
                  }}
                  className={`px-5 py-2 rounded-full font-medium shadow transition ${
                    showCompletedOnly
                      ? "bg-green-500 text-white hover:bg-green-600"
                      : "bg-green-100 text-green-800 hover:bg-green-200"
                  }`}
                >
                  {showCompletedOnly ? "Show All" : "Show Completed Only"}
                </motion.button>
              </div>
            </div>
            {visibleApplications.length === 0 ? (
              <p className="text-gray-800">You haven’t signed up for any opportunities yet.</p>
            ) : (
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                key={visibleApplications.length}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {visibleApplications.map((op, i) => (
                  <motion.div
                    key={op.id}
                    variants={fadeInUp}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ scale: 1.03, y: -4 }}
                    className="flex"
                  >
                    <OpportunityCard opportunity={op} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </motion.main>
      <Chatbot/>
    </div>
  );
}
