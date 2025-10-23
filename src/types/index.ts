// types.ts
export interface Opportunity {
  id: number;
  title: string;
  organization: string;
  date: string;
  cause: string;
  hours: number;
  hasRSVPed?: boolean; // ✅ optional
}

export interface UserApplication {
  id: string;
  user_id: string;
  opportunity_id: string;
  status: string;
}

export interface UserApplicationWithOpportunity {
  id: string;
  status: string;
  opportunity: Opportunity;
}
