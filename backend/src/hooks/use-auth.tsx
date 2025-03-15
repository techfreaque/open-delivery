"use client";

import { useRouter } from "next/navigation";
import type { Dispatch, JSX, ReactNode, SetStateAction } from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { errorLogger, parseError } from "@/lib/utils";
import type {
  LoginFormType,
  LoginResponseType,
  RegisterType,
  ResponseType,
  UserResponseType,
} from "@/types/types";

import { backendPages } from "../constants";

interface AuthContextType {
  user: UserResponseType | null;
  isLoggedIn: boolean;
  loading: boolean;
  error: string | null;
  login: (credentials: LoginFormType) => Promise<UserResponseType | null>;
  logout: () => void;
  signup: (formData: RegisterType) => Promise<void>;
}

// Create the Auth Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export function AuthProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const [user, setUser] = useState<UserResponseType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check for existing user session
    const checkSession = (): void => {
      if (typeof window === "undefined") {
        return;
      }

      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const parsedUser: UserResponseType = JSON.parse(storedUser);
          setUser(parsedUser);
        } catch (err) {
          errorLogger("Invalid stored user data", err);
          // Invalid stored user data
          localStorage.removeItem("user");
          localStorage.removeItem("authToken");
        }
      }
      setLoading(false);
    };

    checkSession();
  }, []);

  const login = useCallback(
    async (credentials: LoginFormType): Promise<UserResponseType | null> => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/v1/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials),
        });

        const data = (await response.json()) as ResponseType<LoginResponseType>;
        if (data.success === false) {
          setError(data.message || "Login failed");
          setLoading(false);
          return null;
        }

        const loginResponseData = data;
        return _login(loginResponseData, setUser, setLoading);
      } catch (err) {
        const error = parseError(err);
        setError(`An error occurred during login - error: ${error.message}`);
        setLoading(false);
        return null;
      }
    },
    [],
  );

  const signup = useCallback(
    async (formData: RegisterType): Promise<void> => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("/api/v1/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const data = (await response.json()) as ResponseType<LoginResponseType>;
        _login(data, setUser, setLoading);
        router.push("/v1/auth/login");
      } catch (err) {
        const error = parseError(err);
        setError(`An error occurred during signup - error: ${error.message}`);
      } finally {
        setLoading(false);
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
    void fetch("/api/v1/auth/logout", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
      },
    });
    router.push(backendPages.login);
  }, [router]);

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    signup,
    isLoggedIn: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use the auth context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}

function _login(
  loginResponseData: ResponseType<LoginResponseType>,
  setUser: Dispatch<SetStateAction<UserResponseType | null>>,
  setLoading: Dispatch<SetStateAction<boolean>>,
): UserResponseType {
  if (loginResponseData.success) {
    const loginData = loginResponseData.data;
    setUser(loginData.user);
    localStorage.setItem("user", JSON.stringify(loginData.user));
    localStorage.setItem("authToken", loginData.token);
    setLoading(false);
    return loginData.user;
  }
  throw new Error(loginResponseData.message);
}
