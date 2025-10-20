// ProfileCard.tsx
import { useState } from "react";
import { useAuth } from "./AuthProvider";
import EditProfileModal from "./EditProfileModal";
import Image from "next/image";

export default function ProfileCard() {
  const { profile, signOut } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!profile) return null;

  return (
    <>
      <div className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-md space-y-4 max-w-sm mx-auto">
        {/* Avatar */}
        <div className="w-24 h-24 relative rounded-full overflow-hidden">
          <Image
            src={profile.avatar_url || "/default-avatar.png"}
            alt="Avatar"
            fill
            className="object-cover"
          />
        </div>

        {/* Name & Email */}
        <h2 className="text-lg font-semibold">{profile.name || "User"}</h2>
        <p className="text-gray-500 text-sm">{profile.email}</p>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            onClick={() => setIsModalOpen(true)}
          >
            Edit Profile
          </button>
          <button
            className="px-4 py-2 border border-red-500 text-red-500 rounded-lg"
            onClick={signOut}
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Edit Modal */}
      <EditProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}



