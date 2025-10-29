/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/lib/supabaseClient";

interface UserProfile {
  id: string;
  email: string;
  role: string; 
  name?: string;
  avatar_url?: string;
  bio?: string;
  school?: string;
}

interface AuthContextValue {
  user: any | null;
  profile: UserProfile | null;
  loading: boolean;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  profile: null,
  loading: true,
  updateProfile: async () => {},
  signOut: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        await upsertUser(user);
        await fetchProfile(user.id);
      }
      setLoading(false);
    };
    initAuth();

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser(session.user);
        await upsertUser(session.user);
        await fetchProfile(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
      }
    });

    return () => listener?.subscription.unsubscribe();
  }, []);

  const upsertUser = async (user: any) => {
  await supabase
    .from("users")
    .upsert(
      {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.full_name,
        avatar_url: user.user_metadata?.avatar_url,
      },
      { onConflict: "id", ignoreDuplicates: true } // <- preserves existing role
        );
    };


  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (!error && data) setProfile(data);
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;
    const { data, error } = await supabase
      .from("users")
      .update(updates)
      .eq("id", user.id)
      .select()
      .single();
    if (!error && data) setProfile(data);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, updateProfile, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
