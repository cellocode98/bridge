"use client";

import ProfileCard from "@/components/ProfileCard";
import { useAuth } from "@/components/AuthProvider";

export default function ProfilePage() {
  const { loading, user } = useAuth();

  if (loading) return <p className="text-center mt-20 text-gray-500">Loading...</p>;
  if (!user) return <p className="text-center mt-20 text-gray-500">Please sign in to view your profile.</p>;

  return (
  <main className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6 pt-24 flex flex-col items-center">
  <h1 className="text-3xl font-bold mb-8 text-gray-800">My Profile</h1>
  <ProfileCard />
  </main>

  );
}
