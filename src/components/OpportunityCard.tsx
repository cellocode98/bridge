// src/components/OpportunityCard.tsx
import React from "react";

export interface Opportunity {
  id: string;
  title: string;
  organization: string;
  date: string;
  cause: string;
  hours: number;
  status: string; // pending, completed, etc
  applied_at: string;
}

const OpportunityCard: React.FC<{ opportunity: Opportunity }> = ({ opportunity }) => {
  const isCompleted = opportunity.status === "Completed";

  return (
    <div
      className={`
        relative p-6 rounded-3xl shadow-xl flex flex-col justify-between transition-transform
        ${
          isCompleted
            ? "bg-gray-100/40 backdrop-blur-sm cursor-default opacity-70"
            : "bg-white/30 backdrop-blur-lg hover:shadow-2xl hover:scale-105"
        }
      `}
    >
      {/* Ribbon for completed */}
      {isCompleted && (
        <div className="absolute top-2 right-2 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full">
          Completed
        </div>
      )}

      <div className="mb-4">
        <h2 className={`text-xl font-bold mb-1 ${isCompleted ? "text-gray-700" : "text-gray-900"}`}>
          {opportunity.title}
        </h2>
        <p className={`text-sm mb-1 ${isCompleted ? "text-gray-600" : "text-gray-800"}`}>
          {opportunity.organization} • {opportunity.date}
        </p>
        <p className={`text-sm ${isCompleted ? "text-gray-600" : "text-gray-800"}`}>
          Cause: {opportunity.cause} • Hours: {opportunity.hours}
        </p>
      </div>

      {/* Status Badge */}
      {!isCompleted && (
        <span
          className={`px-2 py-1 rounded text-sm font-medium ${
            opportunity.status === "Upcoming"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {opportunity.status}
        </span>
      )}
    </div>
  );
};

export default OpportunityCard;
