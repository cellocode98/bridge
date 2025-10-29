"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export interface Opportunity {
  id: string;
  title: string;
  organization: string;
  date: string; // in ISO or readable format
  cause: string;
  hours: number;
  status?: string; // dynamically set
  verified?: boolean; // from proofs table
}

// props: Opportunity + isCompleted from parent
const OpportunityCard: React.FC<{ opportunity: Opportunity & { isCompleted?: boolean } }> = ({
  opportunity,
}) => {
  const eventDate = new Date(opportunity.date);
  const now = new Date();

  const isCompleted = opportunity.isCompleted === true;
  const hasPassed = eventDate < now;

  // determine display status
  let displayStatus = "Upcoming";
  if (isCompleted) displayStatus = "Completed";
  else if (hasPassed) displayStatus = "Pending";

  const showAddProof = displayStatus === "Pending";

  return (
    <div
      className={`
        relative w-full p-6 rounded-3xl shadow-xl flex flex-col justify-between transition-transform
        ${isCompleted
          ? "bg-gray-100/40 backdrop-blur-sm cursor-default opacity-90"
          : "bg-white/30 backdrop-blur-lg hover:shadow-2xl hover:scale-105"}
      `}
    >
      {/* Ribbon */}
      {displayStatus === "Completed" ? (
        <div className="absolute top-2 right-2 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
          Completed
        </div>
      ) : displayStatus === "Pending" ? (
        <div className="absolute top-2 right-2 bg-yellow-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
          Pending
        </div>
      ) : (
        <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
          Upcoming
        </div>
      )}

      {/* Title + Details */}
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-1 text-gray-900">{opportunity.title}</h2>
        <p className="text-sm mb-1 text-gray-800">
          {opportunity.organization} • {opportunity.date}
        </p>
        <p className="text-sm text-gray-800">
          Cause: {opportunity.cause} • Hours: {opportunity.hours}
        </p>
      </div>

      {/* Add Proof Button */}
      {showAddProof && (
        <a
          href={`dashboard/proof?opportunityId=${opportunity.id}`}
          className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm text-center transition"
        >
          Add Proof
        </a>
      )}
    </div>
  );
};


export default OpportunityCard
