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

interface Opportunity {
  id: string;
  title: string;
  organization: string;
  date: string;
  cause: string;
  hours: number;
  status: string;
  applied_at: string;
}

// Framer Motion Variants
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hideCompleted, setHideCompleted] = useState(false);

  const totalApplied = applications.length;
  const completed = applications.filter((a) => a.status === "Completed").length;
  const upcoming = applications.filter((a) => a.status === "pending").length;
  const totalHours = applications.reduce((sum, a) => sum + a.hours, 0);

  useEffect(() => {
    if (!profile) return;
    const fetchApplications = async () => {
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
              start_date,
              end_date
            )
          `)
          .eq("user_id", profile.id);

        if (error) throw error;

        const userOpportunities = data.map((item: any) => ({
          id: item.opportunity.id,
          title: item.opportunity.title,
          organization: item.opportunity.organization,
          date: item.opportunity.start_date,
          cause: item.opportunity.category,
          hours: 2,
          status: item.status,
          applied_at: item.applied_at,
        }));

        setApplications(userOpportunities);
      } catch (err) {
        console.error(err);
      }
    };
    fetchApplications();
  }, [profile]);

  if (loading) return <p className="text-center mt-20 text-gray-500">Loading...</p>;
  if (!profile) return <p className="text-center mt-20 text-gray-500">Please sign in.</p>;

  const displayedApplications = hideCompleted
    ? applications.filter((a) => a.status !== "Completed")
    : applications;

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

      {/* Unified Dashboard Container */}
      <div className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-3xl shadow-2xl p-8 flex flex-col gap-10">
        {/* Quick Actions + Stats / Badges / Hours Row */}
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

            {/* Milestones Card */}
            <motion.div variants={fadeInUp} className="w-64 p-6 bg-blue-50 backdrop-blur-lg border border-white/30 rounded-3xl flex flex-col gap-4 flex-shrink-0">
              <h3 className="text-lg font-semibold text-gray-800">Milestones</h3>
              <div className="flex flex-col gap-3">
                <div className="p-2 bg-yellow-100 rounded-xl text-sm font-medium text-yellow-800">First Application Completed</div>
                <div className="p-2 bg-yellow-200 rounded-xl text-sm font-medium text-yellow-900">5 Hours Volunteered</div>
                <div className="p-2 bg-yellow-300 rounded-xl text-sm font-medium text-yellow-900">Completed 10 Opportunities</div>
              </div>
            </motion.div>

            {/* Hours Breakdown */}
            <motion.div variants={fadeInUp} className="w-96 p-5 bg-blue-50 backdrop-blur-lg border border-white/30 rounded-3xl flex flex-col gap-4 flex-shrink-0">
              <h3 className="text-lg font-semibold text-gray-800">Hours by Cause</h3>
              <HoursPieChart
                data={[
                  { cause: "Environment", hours: 10 },
                  { cause: "Education", hours: 5 },
                  { cause: "Community", hours: 8 },
                ]}
              />
            </motion.div>

            <motion.div variants={fadeInUp} className="w-96 p-5 bg-blue-50 backdrop-blur-lg border border-white/30 rounded-3xl flex flex-col gap-4 flex-shrink-0">
              <h3 className="text-lg font-semibold text-gray-800">Impact Score</h3>
              <ImpactScore
              />
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
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setHideCompleted(!hideCompleted)}
              className={`px-5 py-2 rounded-full font-medium shadow transition ${
                hideCompleted
                  ? "bg-gray-800 text-white hover:bg-gray-700"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              {hideCompleted ? `Show Completed (${completed})` : `Hide Completed (${completed})`}
            </motion.button>
          </div>

          {displayedApplications.length === 0 ? (
            <p className="text-gray-800">You haven’t signed up for any opportunities yet.</p>
          ) : (
            <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible" // <- animate on every render
            key={displayedApplications.length} // forces re-render of motion container when the list changes
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {displayedApplications.map((op, i) => (
              <motion.div
                key={op.id}
                variants={fadeInUp}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.03, y: -4 }}
                className="flex"
              >
                <div className="flex-1 h-full">
                  <OpportunityCard opportunity={op} />
                </div>
              </motion.div>
            ))}
          </motion.div>
          )}
        </div>
      </div>
    </motion.main>
    </div>
  );
}
