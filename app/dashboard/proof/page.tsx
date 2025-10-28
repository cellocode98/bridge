"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import ProofUploadPage from "@/components/ProofPage";
import { Suspense } from "react";

export default function ProofPage() {
  return(
    <Suspense>
    <ProofUploadPage/>
    </Suspense>
  );
}
