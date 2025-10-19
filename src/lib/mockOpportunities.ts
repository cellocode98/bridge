// src/lib/mockOpportunities.ts
import { Opportunity } from "../types";

export const opportunities: Opportunity[] = [
  {
    id: 1,
    title: "Park Cleanup",
    organization: "Green Chicago",
    type: "Environment",
    description: "Help clean and beautify local parks in your community.",
    date: "2025-10-25",
    location: "Lincoln Park, Chicago",
    slots: 20
  },
  {
    id: 2,
    title: "Food Pantry Volunteer",
    organization: "City Food Bank",
    type: "Community Service",
    description: "Sort and distribute food to families in need.",
    date: "2025-10-28",
    location: "Downtown Chicago",
    slots: 15
  },
  {
    id: 3,
    title: "Senior Center Support",
    organization: "Silver Hearts",
    type: "Elder Care",
    description: "Assist seniors with daily activities and events.",
    date: "2025-11-01",
    location: "North Side Chicago",
    slots: 10
  }
];
