import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// Admin client for storage & table writes
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fileBase64, opportunity_id, verification_code, user_id } = body;

    if (!fileBase64 || !opportunity_id || !user_id || !verification_code) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const buffer = Buffer.from(fileBase64, "base64");
    const fileName = `${user_id}-${Date.now()}-proof.png`;

    const { data: storageData, error: storageError } = await supabaseAdmin
      .storage
      .from("proofs")
      .upload(fileName, buffer, { upsert: true });

    if (storageError) {
      console.error("Storage upload error:", storageError);
      return NextResponse.json({ error: storageError.message }, { status: 500 });
    }

    const { data: publicUrlData} = supabaseAdmin
      .storage
      .from("proofs")
      .getPublicUrl(storageData.path);


    const imageUrl = publicUrlData.publicUrl;

    const { error: insertError } = await supabaseAdmin
      .from("proofs")
      .insert([{
        user_id,
        opportunity_id,
        image_url: imageUrl,
        verification_code,
        verified: false,
      }]);

    if (insertError) {
      console.error("Insert error:", insertError);
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Upload + insert successful", imageUrl });
  } catch (err: any) {
    console.error("Unexpected error:", err);
    return NextResponse.json({ error: err.message || "Unknown error" }, { status: 500 });
  }
}
