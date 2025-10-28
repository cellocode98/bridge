"use client";

import Image from "next/image";
import { useAuth } from "./AuthProvider";

interface UserHeroProps {
  subtitle?: string;
}

export default function UserHero({ subtitle }: UserHeroProps) {
  const { profile } = useAuth();

  if (!profile) return null;

  return (
    <div className="flex flex-col md:flex-row items-center gap-6 pt-3">
      {/* Avatar */}
      <div className="w-28 h-28 relative rounded-full overflow-hidden">
        <Image
          src={profile.avatar_url || "/default-avatar.png"}
          alt="Avatar"
          fill
          className="object-cover"
        />
      </div>

      {/* Greeting & Subtitle */}
      <div>
        <h1 className="text-3xl font-bold text-gray-700 font-sans">{`Welcome, ${profile.name || "User"}!`}</h1>
        {subtitle && <p className="text-gray-700 mt-1">{subtitle}</p>}
      </div>
    </div>
  );
}
