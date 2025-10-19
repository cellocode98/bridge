// src/components/OpportunityCard.tsx
import React from "react";
import { Opportunity } from "../data/opportunities";

interface Props {
  opportunity: Opportunity;
  onRSVP: (id: number) => void;
}

const OpportunityCard: React.FC<Props> = ({ opportunity, onRSVP }) => {
  return (
    <div className="border p-4 rounded shadow mb-4">
      <h2 className="text-xl font-bold">{opportunity.title}</h2>
      <p>{opportunity.organization} • {opportunity.date}</p>
      <p>Cause: {opportunity.cause} • Hours: {opportunity.hours}</p>
      <button
        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        onClick={() => onRSVP(opportunity.id)}
      >
        RSVP
      </button>
    </div>
  );
};

export default OpportunityCard;