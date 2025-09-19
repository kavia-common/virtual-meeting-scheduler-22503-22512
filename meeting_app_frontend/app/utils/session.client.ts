import { useEffect, useState } from "react";
import { AuthAPI, getToken, setToken, type User } from "./api";

/**
 * PUBLIC_INTERFACE
 * useAuth returns the current user, loading state, and actions to sign in/out.
 */
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setInitializing(false);
      return;
    }
    AuthAPI.me()
      .then(setUser)
      .catch(() => {
        setToken(null);
        setUser(null);
      })
      .finally(() => setInitializing(false));
  }, []);

  const signOut = () => {
    setToken(null);
    setUser(null);
    // reload to reset loaders/actions if needed
    if (typeof window !== "undefined") window.location.href = "/signin";
  };

  return { user, setUser, initializing, signOut };
}
