"use client";

import { authClient } from "@/lib/auth-client";
import { createContext, useContext } from "react";

type SessionType = typeof authClient.$Infer.Session | null;

const AuthContext = createContext<{ session: SessionType } | null>(null);

export function AuthProvider({
  children,
  initialSession,
}: {
  children: React.ReactNode;
  initialSession: SessionType;
}) {
  const { data: clientSession, isPending } = authClient.useSession();

  const session = isPending ? initialSession : clientSession;

  return (
    <AuthContext.Provider value={{ session }}>{children}</AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
