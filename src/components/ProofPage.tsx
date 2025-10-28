"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/components/AuthProvider"; // adjust this import if needed

export default function ProofUploadPage() {
  const { user, loading } = useAuth();

  const searchParams = useSearchParams();
  const opportunityId = searchParams.get("opportunityId");

  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState<string | null>(null);

  function generateCode(length = 6) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  }

  async function handleUpload() {

    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !sessionData?.session?.user) {
      console.error("No valid session");
      setUploading(false);
      return;
    }
    const uid = sessionData.session.user.id;

    if (!file || !user || !opportunityId) {
      alert("Missing file, user, or opportunity.");
      return;
    }

    try {
      setUploading(true);

      // 1️⃣ Upload to Supabase Storage
      const fileName = `${user.id}-${Date.now()}-${file.name}`;
      const { data: storageData, error: storageError } = await supabase.storage
        .from("proofs") // ensure this bucket exists in Supabase Storage
        .upload(fileName, file);

      if (storageError) throw storageError;

      const { data: publicUrlData } = supabase.storage
        .from("proofs")
        .getPublicUrl(storageData.path);

      const imageUrl = publicUrlData.publicUrl;
      setUploadedUrl(imageUrl);

      // 2️⃣ Generate verification code
      const verificationCode = generateCode();
      setVerificationCode(verificationCode);

      // 3️⃣ Insert record into proofs table
      const { error: insertError } = await supabase.from("proofs").insert([
        {
            user_id: uid,  // must match auth.uid()
            opportunity_id: opportunityId,
            image_url: imageUrl,
            verification_code: verificationCode,
            verified: false,
        },
        ]);

      if (insertError) throw insertError;

      alert("Proof uploaded successfully!");
    } catch (error) {
      console.error(error);
      alert("Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  if (loading) return <p>Loading session...</p>;
  if (!user) return <p>Please log in to upload proof.</p>;
  console.log("User object:", user);
console.log("user.id:", user?.id);

  return (
    <div data-page-title="Upload Proof" className="max-w-lg mx-auto mt-16 p-6 bg-white/40 backdrop-blur-lg rounded-3xl shadow-xl">
      <h1 className="text-2xl font-bold mb-4 text-gray-700">Upload Proof of Service</h1>

      <p className="mb-4 text-sm text-gray-700">
        Please upload a photo of your signed verification form or other proof for this opportunity.
      </p>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        className="mb-4 block w-full text-sm text-gray-700"
      />

      <button
        disabled={!file || uploading}
        onClick={handleUpload}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50"
      >
        {uploading ? "Uploading..." : "Upload Proof"}
      </button>

      {uploadedUrl && (
        <div className="mt-6 text-center">
          <img
            src={uploadedUrl}
            alt="Proof"
            className="mx-auto rounded-lg shadow-md max-h-64 object-cover mb-2"
          />
          <p className="text-sm text-gray-700">
            ✅ Uploaded successfully! <br />
            Your verification code:{" "}
            <span className="font-mono font-bold text-blue-700">{verificationCode}</span>
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Share this code with your organization for validation.
          </p>
        </div>
      )}
    </div>
  );
}
