"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { backendPages } from "@/constants";
import type { LoginData, LoginResponse, UserResponse } from "@/types/types";

interface UseAuthReturn {
  user: UserResponse | null;
  loading: boolean;
  login: (credentials: LoginData) => Promise<UserResponse | null>;
  logout: () => void;
  error: string | null;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check for existing user session
    const checkSession = (): void => {
      if (typeof window === "undefined") {
        return;
      } // Server-side safety check

      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const parsedUser: UserResponse = JSON.parse(storedUser);
          setUser(parsedUser);
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
          // Invalid stored user data
          localStorage.removeItem("user");
        }
      }
      setLoading(false);
    };

    checkSession();
  }, []);

  const login = useCallback(
    async (credentials: LoginData): Promise<UserResponse | null> => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/v1/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials),
        });

        const data = await response.json();

        if (!response.ok) {
          const errorData = data as { error: string };
          setError(errorData.error || "Login failed");
          setLoading(false);
          return null;
        }

        const loginData = data as LoginResponse;
        setUser(loginData.user);

        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(loginData.user));
          // Store the token for API requests
          if (loginData.token) {
            localStorage.setItem("authToken", loginData.token);
          }
        }

        setLoading(false);

        return loginData.user;
      } catch (err) {
        // Use logger instead of console in production
        setError(`An error occurred during login - error: ${err}`);
        setLoading(false);
        return null;
      }
    },
    [router],
  );

  const logout = useCallback((): void => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("user");
      localStorage.removeItem("authToken");
    }
    setUser(null);
    router.push(backendPages.login);
  }, [router]);

  return { user, loading, login, logout, error };
}
