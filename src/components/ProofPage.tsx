"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/components/AuthProvider"; // adjust this import if needed
import toast from "react-hot-toast";

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
  if (!user || !file || !opportunityId) {
    toast.error("Missing user, file, or opportunity ID.");
    return;
  }

  try {
    setUploading(true);

    // Convert file to base64
    const reader = new FileReader();
    const base64: string = await new Promise((resolve, reject) => {
      reader.onload = () => resolve((reader.result as string).split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    // Generate verification code
    const verificationCode = generateCode();
    setVerificationCode(verificationCode);

    // Call server-side API
    const response = await fetch("/api/upload-proof", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fileBase64: base64,
        user_id: user.id,
        opportunity_id: opportunityId,
        verification_code: verificationCode,
      }),
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Server error");

    setUploadedUrl(result.imageUrl);
    toast.success("Proof uploaded successfully!");
  } catch (error: any) {
    console.error("Upload failed:", error);
    toast.error(`Upload failed: ${error.message || error}`);
  } finally {
    setUploading(false);
  }
}


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
