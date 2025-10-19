// src/components/ProfilePage.tsx
"use client";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "./AuthProvider";
import { opportunities as mockOpportunities } from "../lib/mockOpportunities";
import { Opportunity } from "../types";

export default function ProfilePage() {
  const { user } = useAuth();
  const [signedUpOps, setSignedUpOps] = useState<Opportunity[]>([]);

  useEffect(() => {
    if (!user) return;

    const fetchSignedUpOps = async () => {
      const { data, error } = await supabase
        .from("signups")
        .select("opportunity_id")
        .eq("user_id", user.id);

      if (!error && data) {
        const signedUpIds = data.map((d) => d.opportunity_id);
        setSignedUpOps(mockOpportunities.filter((op) => signedUpIds.includes(op.id)));
      }
    };

    fetchSignedUpOps();
  }, [user]);

  if (!user) {
    return <p className="text-center mt-8">Please log in to see your profile.</p>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Your Profile</h1>

      {/* User Info */}
      <div className="mb-8 text-center">
        <div className="inline-block mb-2 w-24 h-24 bg-gray-300 rounded-full" />
        <h2 className="text-xl font-semibold">{user.user_metadata.full_name || user.email}</h2>
        <p className="text-gray-600">{user.email}</p>
      </div>

      {/* Signed-Up Opportunities */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Signed-Up Opportunities</h2>
        {signedUpOps.length === 0 && <p>No opportunities signed up yet.</p>}
        <div className="grid gap-4">
          {signedUpOps.map((op) => (
            <div key={op.id} className="border rounded-lg p-4 shadow hover:shadow-md transition">
              <h3 className="text-lg font-semibold">{op.title}</h3>
              <p className="text-gray-600">{op.organization}</p>
              <p className="text-sm text-gray-500">{op.date} | {op.location}</p>
              <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mt-2">
                Signed Up
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

