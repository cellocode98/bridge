// app/profile/page.tsx
"use client";

import ProfileCard from "@/components/ProfileCard";
import UserHero from "@/components/UserHero";

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6">
      <UserHero subtitle="Here's a snapshot of your volunteer activity." />
      <div className="mt-8">
        <ProfileCard />
      </div>
    </main>
  );
}
