/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/lib/supabaseClient";

interface UserProfile {
  id: string;
  email: string;
  role?: string;
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
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) console.error("Error getting session:", error);

        if (session?.user) {
          setUser(session.user);
          await upsertUser(session.user);
          await fetchProfile(session.user.id);
        }
      } catch (err) {
        console.error("Error initializing auth:", err);
      } finally {
        setLoading(false); // ensure loading ends
      }
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

    return () => listener.subscription.unsubscribe();
  }, []);

  const upsertUser = async (user: any) => {
    try {
      await supabase.from("users").upsert(
        {
          id: user.id,
          email: user.email,
          name: user.user_metadata?.full_name,
          avatar_url: user.user_metadata?.avatar_url,
        },
        { onConflict: "id", ignoreDuplicates: true } // preserves existing role
      );
    } catch (err) {
      console.error("Error upserting user:", err);
    }
  };

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase.from("users").select("*").eq("id", userId).single();
      if (error) console.error("Error fetching profile:", error);
      if (data) setProfile(data);
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from("users")
        .update(updates)
        .eq("id", user.id)
        .select()
        .single();
      if (error) console.error("Error updating profile:", error);
      if (data) setProfile(data);
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error("Error signing out:", err);
    } finally {
      setUser(null);
      setProfile(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, updateProfile, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
