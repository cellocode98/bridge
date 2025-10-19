// src/data/opportunities.ts

export interface Opportunity {
  id: number;
  title: string;
  organization: string;
  date: string;
  cause: string;
  hours: number;
}

export const opportunities: Opportunity[] = [
  { id: 1, title: "Tutoring Elementary Kids", organization: "Local Library", date: "2025-10-25", cause: "Education", hours: 2 },
  { id: 2, title: "Park Cleanup", organization: "Green Earth Org", date: "2025-10-27", cause: "Environment", hours: 3 },
  { id: 3, title: "Food Bank Volunteer", organization: "City Food Bank", date: "2025-10-30", cause: "Community", hours: 4 },
];