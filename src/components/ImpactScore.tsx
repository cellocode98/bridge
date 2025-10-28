// src/components/ImpactScore.tsx
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "./AuthProvider";

interface Opportunity {
  id: string;
  hours: number;
  featured: boolean;
}

export default function ImpactScore() {
  const { profile } = useAuth();
  const [score, setScore] = useState<number | null>(null);

  // Define tiers and thresholds
  const tiers = [
    { name: "Bronze", min: 0, max: 10 },
    { name: "Silver", min: 10, max: 30 },
    { name: "Gold", min: 30, max: 50 },
    { name: "Platinum", min: 50, max: 100 },
  ];

  useEffect(() => {
    if (!profile) return;

    const fetchImpact = async () => {
      const { data: proofs, error } = await supabase
        .from("proofs")
        .select(`
          opportunity:opportunity_id (
            hours,
            featured
          )
        `)
        .eq("user_id", profile.id)
        .eq("verified", true);

      if (error) {
        console.error("Failed to fetch proofs:", error);
        setScore(0);
        return;
      }

      let totalScore = 0;
      (proofs || []).forEach((proof: any) => {
        const hours = proof.opportunity?.hours || 0;
        const multiplier = proof.opportunity?.featured ? 1.5 : 1;
        totalScore += hours * multiplier;
      });

      setScore(totalScore);
    };

    fetchImpact();
  }, [profile]);

  if (score === null) return <p>Loading impact score...</p>;

  // Determine current tier
  const currentTier = tiers.find((t) => score >= t.min && score < t.max) || tiers[tiers.length - 1];
  const nextTier = tiers.find((t) => t.min > currentTier.min);

  // Calculate progress towards next tier
  const progress = nextTier
    ? Math.min((score - currentTier.min) / (nextTier.min - currentTier.min), 1)
    : 1; // Full if at top tier

  return (
    <div className="p-4 bg-white rounded-lg shadow-md max-w-sm">
      <h2 className="text-xl font-bold mb-2 text-gray-700">Impact Score</h2>
      <p className="text-lg font-semibold mb-2 text-gray-700">{score.toFixed(1)}</p>
      <p className="text-sm text-gray-600 mb-2">Tier: {currentTier.name}</p>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
        <div
          className="h-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
          style={{ width: `${(progress || 0) * 100}%`, transition: "width 0.5s ease" }}
        />
      </div>

      {nextTier && (
        <p className="text-xs text-gray-500 mt-1">
          {score.toFixed(1)} / {nextTier.min} points to reach {nextTier.name}
        </p>
      )}
      {!nextTier && <p className="text-xs text-gray-500 mt-1">Max tier reached! 🎉</p>}
    </div>
  );
}
