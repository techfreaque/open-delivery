"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import type { JSX, ReactNode } from "react";
import { createContext, useContext } from "react";

import {
  useApiMutation,
  useApiQuery,
} from "@/next-portal/client/api/api-client";
import {
  removeAuthToken,
  setAuthToken,
} from "@/next-portal/client/auth/auth-client";
import type { UndefinedType } from "@/next-portal/types/common.schema";
import { errorLogger } from "@/next-portal/utils/logger";
import { parseError } from "@/next-portal/utils/parse-error";

import { backendPages } from "../constants";
import {
  loginEndpoint,
  logoutEndpoint,
  meEndpoint,
  registerEndpoint,
} from "../schema/api/apis";
import type {
  LoginFormType,
  LoginResponseType,
} from "../schema/api/v1/auth/public/login.schema";
import type { RegisterType, UserResponseType } from "../schema/schemas";

interface AuthContextType {
  user: UserResponseType | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  isLoadingInitial: boolean;
  error: Error | null;
  login: (credentials: LoginFormType) => Promise<UserResponseType | null>;
  logout: () => Promise<void>;
  signup: (formData: RegisterType) => Promise<void>;
  statusMessage: string;
}

// Create the Auth Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export function AuthProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const queryClient = useQueryClient();
  const router = useRouter();

  // Query to fetch the current user
  const {
    data: user,
    isLoading,
    error,
    isLoadingFresh: isLoadingInitial,
    statusMessage,
  } = useApiQuery(["user"], meEndpoint, {
    retry: false,
    staleTime: 5 * 60 * 1000, // Cache the user data for 5 minutes
    refetchOnWindowFocus: false,
  });

  // Mutation for login
  const loginMutation = useApiMutation<
    LoginResponseType,
    LoginFormType,
    UndefinedType
  >(loginEndpoint, {
    onSuccess: async (data) => {
      if (data.token) {
        // Store the token in storage
        await setAuthToken(data.token);

        // Update the user cache upon successful login
        queryClient.setQueryData(["user"], data.user);
      }
    },
  });

  // Mutation for signup
  const signupMutation = useApiMutation<
    LoginResponseType,
    RegisterType,
    UndefinedType
  >(registerEndpoint, {
    onSuccess: async (data) => {
      if (data.token) {
        await setAuthToken(data.token);
        queryClient.setQueryData(["user"], data.user);
        router.push(backendPages.login);
      }
    },
  });

  const logoutMutation = useApiMutation(logoutEndpoint, {
    onSuccess: async () => {
      await removeAuthToken();
      queryClient.setQueryData(["user"], null);
      await queryClient.invalidateQueries({ queryKey: ["user"] });
      router.push(backendPages.login);
    },
  });

  const login = async (
    credentials: LoginFormType,
  ): Promise<UserResponseType | null> => {
    try {
      const response = await loginMutation.mutateAsync(credentials);
      return response.user;
    } catch (err) {
      const error = parseError(err);
      errorLogger(`An error occurred during login`, error);
      return null;
    }
  };

  const signup = async (formData: RegisterType): Promise<void> => {
    try {
      await signupMutation.mutateAsync(formData);
    } catch (err) {
      const error = parseError(err);
      errorLogger(`An error occurred during signup`, error);
    }
  };

  const logout = async (): Promise<void> => {
    await logoutMutation.mutateAsync(undefined);
  };

  const value: AuthContextType = {
    user: user ? user : null,
    isLoading,
    isLoadingInitial,
    error,
    login,
    logout,
    signup,
    isLoggedIn: !!user,
    statusMessage,
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
