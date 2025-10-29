import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { proofId } = await req.json();
    if (!proofId) return NextResponse.json({ error: "Missing proof ID" }, { status: 400 });

    const { data: proof, error: proofError } = await supabaseAdmin
      .from("proofs")
      .select("id, user_id, opportunity_id")
      .eq("id", proofId)
      .single();

    if (proofError || !proof) return NextResponse.json({ error: "Proof not found" }, { status: 404 });

    const { error: verifyError } = await supabaseAdmin
      .from("proofs")
      .update({ verified: true })
      .eq("id", proofId);

    if (verifyError) return NextResponse.json({ error: verifyError.message }, { status: 500 });

    const { error: appError } = await supabaseAdmin
      .from("user_applications")
      .update({ status: "Completed" })
      .eq("user_id", proof.user_id)
      .eq("opportunity_id", proof.opportunity_id);

    if (appError) return NextResponse.json({ error: appError.message }, { status: 500 });

    return NextResponse.json({ message: "Proof verified and application marked as completed" });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message || "Unknown error" }, { status: 500 });
  }
}
