"use client";

import { useState, useEffect, FormEvent } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/components/AuthProvider";
import toast from "react-hot-toast";
import Chatbot from "@/components/Chatbot";
import OrganizationChatbot from "@/components/OrgChatbot";

//typescript interfaces
interface Opportunity {
  id?: string;
  title: string;
  description: string;
  featured: boolean;
  address?: string;
  latitude?: number;
  longitude?: number;
  date?: string;
}

interface ProofWithJoins {
  id: string;
  image_url: string;
  verification_code: string;
  verified: boolean;
  user_id: string;
  opportunity_id: string;
  user: { id: string; full_name: string; email: string } | null;
  opportunity: { id: string; title: string; organization: string } | null;
}

export default function OrganizationDashboard() {
  const { profile } = useAuth();

  /** states **/
  const [proofs, setProofs] = useState<ProofWithJoins[]>([]);
  const [loadingProofs, setLoadingProofs] = useState(false);

  const [newOpportunity, setNewOpportunity] = useState<Opportunity>({
    title: "",
    description: "",
    featured: false,
    address: "",
    date: ""
  });
  const [creating, setCreating] = useState(false);

  /** fetch proofs to be verified **/
  useEffect(() => {
    async function fetchPendingProofs() {
      setLoadingProofs(true);
      try {
        const { data: proofsData, error: proofsError } = await supabase
          .from("proofs")
          .select("*")
          .eq("verified", false);
        console.log(proofsData)
        if (proofsError) throw proofsError;

        // enrich
        const enriched: ProofWithJoins[] = await Promise.all(
          (proofsData || []).map(async (proof: any) => {
            const { data: user } = await supabase
              .from("users")
              .select("id, name, email")
              .eq("id", proof.user_id)
              .single();

            const { data: opportunity } = await supabase
              .from("opportunities")
              .select("id, title, organization")
              .eq("id", proof.opportunity_id)
              .single();

            return { ...proof, user, opportunity };
          })
        );

        setProofs(enriched);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load proofs.");
      }
      setLoadingProofs(false);
    }

    fetchPendingProofs();
  }, []);

  /** mark for verify **/
const markVerified = async (id: string) => {
  try {
    const res = await fetch("/api/mark-proof-verified", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ proofId: id }),
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "Failed to verify proof");

    // remove from state instantly so it just pops off 
    setProofs((prev) => prev.filter((p) => p.id !== id));

    toast.success("Proof verified and removed from pending list!");
  } catch (err: any) {
    console.error(err);
    toast.error(err.message || "Failed to verify proof.");
  }
};



  /** geocoding **/
  const geocodeAddress = async (address: string) => {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        address
      )}&format=json&limit=1`
    );
    const data = await res.json();
    if (data && data[0]) return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
    return null;
  };

  /** handle creating opportunity **/
  const handleCreateOpportunity = async (e: FormEvent) => {
  e.preventDefault();
  if (!profile) {
    console.log("No profile found — cannot create opportunity");
    return;
  }

  if (!newOpportunity.title || !newOpportunity.description || !newOpportunity.address) {
    toast.error("Please fill out all required fields.");
    return;
  }

  console.log(" Submitting opportunity with data:", newOpportunity);
  setCreating(true);

  try {
    console.log("Geocoding address:", newOpportunity.address);
    const coords = await geocodeAddress(newOpportunity.address);
    console.log("Geocode result:", coords);

    if (!coords) {
      toast.error("Could not find coordinates for this address.");
      setCreating(false);
      return;
    }

    const opportunityPayload = {
      title: newOpportunity.title,
      description: newOpportunity.description,
      featured: newOpportunity.featured,
      organization: profile.name || profile.email,
      latitude: coords.lat,
      longitude: coords.lng,
      date: new Date(newOpportunity.date || "").toISOString().split("T")[0],
    };

    console.log("Inserting into Supabase:", opportunityPayload);

    const { data, error } = await supabase
      .from("opportunities")
      .insert([opportunityPayload])
      .select(); // <- include so can get response data

    console.log("Supabase insert result:", { data, error });

    if (error) {
      console.error("❌ Supabase insert error:", error);
      toast.error(`Failed to create opportunity: ${error.message}`);
    } else {
      toast.success("✅ Opportunity created!");
      setNewOpportunity({
        title: "",
        description: "",
        featured: false,
        address: "",
        date: "",
      });
    }
  } catch (err) {
    console.error("Unexpected error:", err);
    toast.error("Unexpected error occurred while creating opportunity.");
  }

  console.log("Finished create handler — resetting state.");
  setCreating(false);
};

  
  return (
    <div data-page-title="Organization Dashboard" className="max-w-5xl mx-auto p-6 text-gray-700 pt-20">
      <h1 className="text-3xl font-bold mb-6">Organization Dashboard</h1>

      {/* --- Pending Proofs --- */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Pending Proofs</h2>
        {loadingProofs && <p>Loading proofs...</p>}
        {!loadingProofs && proofs.length === 0 && <p>No pending proofs.</p>}
        <div className="space-y-4">
          {proofs.map((proof) => (
            <div key={proof.id} className="border p-4 rounded">
              <p>
                <strong>User:</strong> {proof.user?.full_name || proof.user?.email || proof.user_id}
              </p>
              <p>
                <strong>Opportunity:</strong>{" "}
                {proof.opportunity?.title || "Unknown"} (
                {proof.opportunity?.organization || "N/A"})
              </p>
              <p>
                <strong>Verification Code:</strong> {proof.verification_code}
              </p>
              <img src={proof.image_url} alt="Proof" className="my-2 max-h-64 object-contain" />
              {!proof.verified && (
                <button
                  onClick={() => markVerified(proof.id)}
                  className="bg-green-600 text-white px-4 py-2 rounded mt-2 hover:bg-green-700"
                >
                  Mark Verified
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* --- Add Opportunity --- */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Add New Opportunity</h2>
        <form onSubmit={handleCreateOpportunity} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Title</label>
            <input
              type="text"
              className="w-full border p-2 rounded"
              value={newOpportunity.title}
              onChange={(e) =>
                setNewOpportunity({ ...newOpportunity, title: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Description / Location</label>
            <textarea
              className="w-full border p-2 rounded"
              value={newOpportunity.description}
              onChange={(e) =>
                setNewOpportunity({ ...newOpportunity, description: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Address</label>
            <input
              type="text"
              className="w-full border p-2 rounded"
              value={newOpportunity.address}
              onChange={(e) =>
                setNewOpportunity({ ...newOpportunity, address: e.target.value })
              }
              placeholder="123 Main St, City, State"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Date</label>
            <input
              type="date"
              className="w-full border p-2 rounded"
              value={newOpportunity.date || ""}
              onChange={(e) =>
                setNewOpportunity({ ...newOpportunity, date: e.target.value })
              }
              required
            />
          </div>


          <button
            type="submit"
            disabled={creating}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {creating ? "Creating..." : "Create Opportunity"}
          </button>
        </form>
      </section>
      <OrganizationChatbot org_name={"Liam"}/>
    </div>
  );
}