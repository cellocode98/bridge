"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import UserHero from "@/components/UserHero";
import { supabase } from "@/lib/supabaseClient";
import CreateOpportunityModal from "@/components/CreateOpportunityModal";

interface Opportunity {
  id: string;
  title: string;
  organization: string;
  status: string;
}

export default function DashboardPage() {
  const { profile, loading } = useAuth();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!profile) return;

    const fetchApplications = async () => {
      const { data, error } = await supabase
        .from("user_applications")
        .select("id, status, opportunity(title, organization)")
        .eq("user_id", profile.id);

      if (!error && data) {
        const apps = data.map((item: any) => ({
          id: item.id,
          status: item.status,
          title: item.opportunity.title,
          organization: item.opportunity.organization,
        }));
        setOpportunities(apps);
      }
    };

    fetchApplications();
  }, [profile]);

  if (loading) return <p className="text-center mt-20 text-gray-500">Loading...</p>;
  if (!profile) return <p className="text-center mt-20 text-gray-500">Please sign in.</p>;

  const totalApplied = opportunities.length;
  const completed = opportunities.filter((o) => o.status === "completed").length;
  const pending = opportunities.filter((o) => o.status === "pending").length;

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6">
        
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
        {/* Blob 1 */}
        <div className="absolute -top-32 -left-32 w-72 h-72 bg-purple-300 rounded-full opacity-30 blur-3xl animate-blobSlow"></div>
        
        {/* Blob 2 */}
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-pink-300 rounded-full opacity-20 blur-3xl animate-blobSlow animation-delay-2000"></div>
        
        {/* Blob 3 */}
        <div className="absolute bottom-0 left-1/2 w-80 h-80 bg-yellow-300 rounded-full opacity-25 blur-3xl animate-blobSlow animation-delay-4000"></div>
        </div>

      {/* Hero Section */}
      <div className="relative flex flex-col md:flex-row items-center gap-6 mb-12 bg-gradient-to-r from-purple-100 via-pink-100 to-red-100 p-6 rounded-2xl shadow-lg overflow-hidden">
        <UserHero subtitle="Here's a snapshot of your volunteer activity." />
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-300 rounded-full opacity-30 animate-pulse"></div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
        <div className="p-6 bg-gradient-to-tr from-blue-400 to-blue-600 text-white rounded-2xl shadow-lg hover:scale-105 transition-transform text-center">
          <p className="text-sm opacity-80">Total Applied</p>
          <p className="text-3xl font-bold">{totalApplied}</p>
        </div>
        <div className="p-6 bg-gradient-to-tr from-yellow-400 to-yellow-600 text-white rounded-2xl shadow-lg hover:scale-105 transition-transform text-center">
          <p className="text-sm opacity-80">Pending</p>
          <p className="text-3xl font-bold">{pending}</p>
        </div>
        <div className="p-6 bg-gradient-to-tr from-green-400 to-green-600 text-white rounded-2xl shadow-lg hover:scale-105 transition-transform text-center">
          <p className="text-sm opacity-80">Completed</p>
          <p className="text-3xl font-bold">{completed}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4 mb-12">
        <button
          className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition font-medium"
          onClick={() => setIsModalOpen(true)}
        >
          ➕ Create Opportunity
        </button>
      </div>
      <CreateOpportunityModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* Applied Opportunities */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-gray-700">My Applications</h2>
        {opportunities.length === 0 ? (
          <p className="text-gray-600">You haven’t applied to any opportunities yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {opportunities.map((opp) => (
              <div key={opp.id} className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition flex justify-between items-center">
                <div>
                  <p className="font-semibold text-gray-800">{opp.title}</p>
                  <p className="text-gray-500 text-sm">{opp.organization}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    opp.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : opp.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {opp.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Badges Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-6 text-gray-700">Badges</h2>
        <div className="flex gap-6 overflow-x-auto pb-4">
          <div className="p-4 bg-yellow-100 rounded-2xl min-w-[140px] text-center hover:scale-105 transition-transform">
            <p className="font-bold text-sm">First Application</p>
          </div>
          <div className="p-4 bg-blue-100 rounded-2xl min-w-[140px] text-center hover:scale-105 transition-transform">
            <p className="font-bold text-sm">5 Hours Volunteered</p>
          </div>
          <div className="p-4 bg-green-100 rounded-2xl min-w-[140px] text-center hover:scale-105 transition-transform">
            <p className="font-bold text-sm">Completed First Opportunity</p>
          </div>
        </div>
      </section>
    </main>
  );
}
