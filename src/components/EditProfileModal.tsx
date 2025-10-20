// src/components/EditProfileModal.tsx
"use client";

import { useState } from "react";
import { useAuth } from "./AuthProvider";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EditProfileModal({ isOpen, onClose }: EditProfileModalProps) {
  const { profile, user, updateProfile } = useAuth();
  const [name, setName] = useState(profile?.name || "");
  const [bio, setBio] = useState(profile?.bio || "");
  const [school, setSchool] = useState(profile?.school || "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  if (!isOpen || !profile || !user) return null;

  const handleSave = async () => {
    try {
      setSaving(true);
      let avatar_url = profile.avatar_url;

      if (avatarFile) {
        const ext = avatarFile.name.split(".").pop();
        const fileName = `${user.id}.${ext}`;
        const filePath = `users/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(filePath, avatarFile, { upsert: true });
        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
        avatar_url = data.publicUrl;
      }

      await updateProfile({ name, bio, school, avatar_url });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl w-96 relative">
        <h2 className="text-xl font-bold mb-4">Edit Profile</h2>

        {/* Avatar */}
        <div className="w-24 h-24 relative rounded-full overflow-hidden mb-4">
          <Image
            src={avatarFile ? URL.createObjectURL(avatarFile) : profile.avatar_url || "/default-avatar.png"}
            alt="Avatar"
            fill
            className="object-cover"
          />
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
          className="mb-4"
        />

        {/* Name */}
        <input
          type="text"
          placeholder="Name"
          className="w-full p-2 border rounded mb-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* Bio */}
        <textarea
          placeholder="Bio"
          className="w-full p-2 border rounded mb-2"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />

        {/* School */}
        <input
          type="text"
          placeholder="School"
          className="w-full p-2 border rounded mb-4"
          value={school}
          onChange={(e) => setSchool(e.target.value)}
        />

        {/* Buttons */}
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 border rounded"
            onClick={onClose}
            disabled={saving}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
