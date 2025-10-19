// src/components/LoginPage.tsx
"use client";
import { supabase } from "../lib/supabaseClient";

export default function Login() {
  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: "google" });
    if (error) console.log(error.message);
  };

  return (
    <button
      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
      onClick={handleLogin}
    >
      Sign in with Google
    </button>
  );
}
