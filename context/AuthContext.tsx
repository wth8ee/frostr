"use client";

import { authClient } from "@/lib/auth-client";
import { createContext, useContext } from "react";

const AuthContext: any = createContext(null);

export function AuthProvider({
  children,
  initialSession,
}: {
  children: React.ReactNode;
  initialSession: any;
}) {
  const { data: clientSession } = authClient.useSession();
  const session: any = !!clientSession ? clientSession : initialSession;

  return (
    <AuthContext.Provider value={{ session }}>{children}</AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
