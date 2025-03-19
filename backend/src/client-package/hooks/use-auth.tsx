"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import type { JSX, ReactNode } from "react";
import { createContext, useContext } from "react";

import { useApiQuery } from "@/next-portal/client/api/use-api-query";
import { useApiMutation } from "@/next-portal/client/api/utils";
import {
  removeAuthToken,
  setAuthToken,
} from "@/next-portal/client/auth/auth-client";
import {
  generateStorageKey,
  setStorageItem,
} from "@/next-portal/client/storage/storage-client";
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
import type { RegisterType } from "../schema/schemas";

interface AuthContextType {
  user: LoginResponseType | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  isLoadingInitial: boolean;
  error: Error | null;
  login: (credentials: LoginFormType) => Promise<LoginResponseType | null>;
  logout: () => Promise<void>;
  signup: (formData: RegisterType) => Promise<LoginResponseType | null>;
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
  } = useApiQuery(meEndpoint, undefined, undefined, {
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
        await setAuthToken(data.token);
        queryClient.setQueryData(loginEndpoint.apiQueryOptions.queryKey, data);
        const storageKey = generateStorageKey(
          loginEndpoint.apiQueryOptions.queryKey,
        );
        void setStorageItem<LoginResponseType>(storageKey, data);
        router.push(backendPages.home);
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
        queryClient.setQueryData(
          registerEndpoint.apiQueryOptions.queryKey,
          data,
        );
        const storageKey = generateStorageKey(
          loginEndpoint.apiQueryOptions.queryKey,
        );
        void setStorageItem<LoginResponseType>(storageKey, data);
        router.push(backendPages.home);
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
    onError: async (err) => {
      errorLogger("An error occurred during logout", err);
      await removeAuthToken();
      queryClient.setQueryData(["user"], null);
      await queryClient.invalidateQueries({ queryKey: ["user"] });
      router.push(backendPages.login);
    },
  });

  const login = async (
    credentials: LoginFormType,
  ): Promise<LoginResponseType | null> => {
    try {
      return loginMutation.mutateAsync(credentials);
    } catch (err) {
      const error = parseError(err);
      errorLogger(`An error occurred during login`, error);
      return null;
    }
  };

  const signup = async (
    formData: RegisterType,
  ): Promise<LoginResponseType | null> => {
    try {
      return signupMutation.mutateAsync(formData);
    } catch (err) {
      const error = parseError(err);
      errorLogger(`An error occurred during signup`, error);
    }
    return null;
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
