// src/types/index.ts
export interface Opportunity {
  id: number;
  title: string;
  organization: string;
  type: string;
  description: string;
  date: string;
  location: string;
  slots: number;
}