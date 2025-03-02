"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

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

        const data: LoginResponse | { error: string } = await response.json();

        if (!response.ok || "error" in data) {
          const errorData = data as { error: string };
          setError(errorData.error || "Login failed");
          setLoading(false);
          return null;
        }

        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
        setLoading(false);

        return data.user;
      } catch (err) {
        // Use logger instead of console in production
        setError(`An error occurred during login - error: ${err}`);
        setLoading(false);
        return null;
      }
    },
    [],
  );

  const logout = useCallback((): void => {
    localStorage.removeItem("user");
    setUser(null);
    // Use logger instead of console in production
    router.push("/v1/auth/login");
  }, [router]);

  return { user, loading, login, logout, error };
}
