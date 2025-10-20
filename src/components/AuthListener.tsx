// src/components/AuthListener.tsx
"use client";
import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function AuthListener({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        await supabase.from("users").upsert({
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata.full_name,
          avatar_url: session.user.user_metadata.avatar_url,
        });
      }
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  return <>{children}</>;
}
