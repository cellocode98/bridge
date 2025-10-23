// src/lib/opportunityService.ts
import { supabase } from "./supabaseClient";

// Fetch all applications for a user
export async function getUserApplications(userId: string) {
  const { data, error } = await supabase
    .from("user_applications")
    .select("opportunity_id, status")
    .eq("user_id", userId);

  if (error) throw error;
  return data; // array of { opportunity_id, status }
}

// RSVP to an opportunity
export async function rsvpOpportunity(userId: string, opportunityId: string) {
  const { data, error } = await supabase
    .from("user_applications")
    .insert({
      user_id: userId,
      opportunity_id: opportunityId,
      status: "pending",
      applied_at: new Date(),
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}
