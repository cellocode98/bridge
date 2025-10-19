// src/components/AuthProvider.tsx
"use client";
import { useEffect, useState, createContext, useContext } from "react";
import { supabase } from "../lib/supabaseClient";
import type { User, Session } from "@supabase/supabase-js";

interface UserContextProps {
  user: User | null;
}

const UserContext = createContext<UserContextProps>({ user: null });

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // load initial session
    supabase.auth.getSession().then(({ data }) => setUser((data as { session: Session | null }).session?.user ?? null));

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session: Session | null) => {
      setUser(session?.user ?? null);
    });

    return () => {
      listener?.subscription?.unsubscribe();
    };
  }, []);

  return <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>;
};

export const useAuth = () => useContext(UserContext);
