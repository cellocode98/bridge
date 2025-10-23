// app/opportunities/create/page.tsx
"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function CreateOpportunityPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert("Please log in first!");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("opportunities").insert([
      {
        title,
        description,
        category,
        location,
        start_date: startDate,
        end_date: endDate,
        created_by: user.id,
      },
    ]);

    setLoading(false);

    if (error) {
      console.log(error.message);
      alert("Error creating opportunity");
    } else {
      alert("Opportunity created!");
      router.push("/opportunities");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Create Opportunity</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-white p-6 rounded-lg shadow">
        <input
          type="text"
          placeholder="Title"
          className="border rounded p-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          className="border rounded p-2"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Category"
          className="border rounded p-2"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Location"
          className="border rounded p-2"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <div className="flex gap-4">
          <input
            type="date"
            className="border rounded p-2 flex-1"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <input
            type="date"
            className="border rounded p-2 flex-1"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white rounded py-2 font-semibold hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Opportunity"}
        </button>
      </form>
    </div>
  );
}
