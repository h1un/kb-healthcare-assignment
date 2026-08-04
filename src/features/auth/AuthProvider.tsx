import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { refreshSession, signIn, signOut } from "@/entities/auth/api";
import { hasRefreshTokenCookie } from "@/shared/api/token-store";
import type { SignInRequest } from "@/shared/api/types";

type AuthStatus = "checking" | "authenticated" | "anonymous";

type AuthContextValue = {
  status: AuthStatus;
  isAuthenticated: boolean;
  sessionExpired: boolean;
  clearSessionExpired: () => void;
  login: (payload: SignInRequest) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

type AuthProviderProps = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [status, setStatus] = useState<AuthStatus>("checking");
  const [sessionExpired, setSessionExpired] = useState(false);

  useEffect(() => {
    if (!hasRefreshTokenCookie()) {
      setStatus("anonymous");
      return;
    }

    let isMounted = true;

    refreshSession()
      .then(() => {
        if (isMounted) {
          setStatus("authenticated");
        }
      })
      .catch(() => {
        signOut();
        if (isMounted) {
          setStatus("anonymous");
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const handleExpired = () => {
      signOut();
      setStatus("anonymous");
      setSessionExpired(true);
    };

    window.addEventListener("auth:expired", handleExpired);
    return () => window.removeEventListener("auth:expired", handleExpired);
  }, []);

  const login = useCallback(async (payload: SignInRequest) => {
    await signIn(payload);
    setSessionExpired(false);
    setStatus("authenticated");
  }, []);

  const logout = useCallback(() => {
    signOut();
    setSessionExpired(false);
    setStatus("anonymous");
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      isAuthenticated: status === "authenticated",
      sessionExpired,
      clearSessionExpired: () => setSessionExpired(false),
      login,
      logout,
    }),
    [login, logout, sessionExpired, status],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider.");
  }

  return context;
}
