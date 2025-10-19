// src/components/OpportunitiesPage.tsx
"use client";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "./AuthProvider";
import { Opportunity } from "../types";
import { opportunities as mockOpportunities } from "../lib/mockOpportunities";

export default function OpportunitiesPage() {
  const { user } = useAuth();
  const [signedUpIds, setSignedUpIds] = useState<number[]>([]);

  // Load signed-up opportunities for this user from Supabase
  useEffect(() => {
    if (!user) return;

    const fetchSignUps = async () => {
      const { data, error } = await supabase
        .from("signups")
        .select("opportunity_id")
        .eq("user_id", user.id);

      if (!error && data) {
        setSignedUpIds(data.map((d) => d.opportunity_id));
      }
    };
    fetchSignUps();
  }, [user]);

  const handleSignUp = async (op: Opportunity) => {
    if (!user) {
      alert("Please log in first!");
      return;
    }

    // Insert into Supabase
    const { error } = await supabase.from("signups").insert({
      user_id: user.id,
      opportunity_id: op.id,
    });

    if (!error) {
      setSignedUpIds((prev) => [...prev, op.id]);
    } else {
      console.error(error.message);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Opportunities</h1>

      <div className="grid gap-4">
        {mockOpportunities.map((op) => (
          <div
            key={op.id}
            className="border rounded-lg p-4 shadow hover:shadow-md transition"
          >
            <h3 className="text-lg font-semibold">{op.title}</h3>
            <p className="text-gray-600">{op.organization}</p>
            <p className="text-sm text-gray-500">{op.date} | {op.location}</p>

            {signedUpIds.includes(op.id) ? (
              <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mt-2">
                Signed Up
              </span>
            ) : (
              <button
                className="bg-blue-600 text-white px-4 py-1 rounded mt-2 hover:bg-blue-700 transition"
                onClick={() => handleSignUp(op)}
              >
                Sign Up
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
