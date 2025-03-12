"use client";

import { useRouter } from "next/navigation";
import type { ChangeEvent, FormEvent } from "react";
import { type FC, useState } from "react";

import { useAuth } from "@/hooks/use-auth";
import { parseError } from "@/lib/utils";
import type { LoginFormType } from "@/types/types";

const LoginPage: FC = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <h1 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Login
        </h1>
        <LoginForm />
      </div>
    </div>
  );
};

const LoginForm: FC = () => {
  const router = useRouter();
  const { login, loading: authLoading } = useAuth();

  const [credentials, setCredentials] = useState<LoginFormType>({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<
    Partial<Record<keyof LoginFormType, string>>
  >({});

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear validation error for this field when user starts typing
    if (validationErrors[name as keyof LoginFormType]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError(null);

    // Client-side validation
    const newValidationErrors: Partial<Record<keyof LoginFormType, string>> =
      {};

    if (!credentials.email) {
      newValidationErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(credentials.email)) {
      newValidationErrors.email = "Please enter a valid email";
    }

    if (!credentials.password) {
      newValidationErrors.password = "Password is required";
    } else if (credentials.password.length < 6) {
      newValidationErrors.password = "Password must be at least 6 characters";
    }

    if (Object.keys(newValidationErrors).length > 0) {
      setValidationErrors(newValidationErrors);
      return;
    }

    setIsLoading(true);

    try {
      await login(credentials);
    } catch (err) {
      const authError = parseError(err);
      setError(authError.message || "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      onSubmit={handleSubmit}
      className="mt-8 space-y-6"
    >
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={credentials.email}
          onChange={handleChange}
          required
          className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm ${
            validationErrors.email ? "border-red-300" : "border-gray-300"
          }`}
        />
        {validationErrors.email && (
          <div className="mt-1 text-sm text-red-600">
            {validationErrors.email}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={credentials.password}
          onChange={handleChange}
          required
          className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm ${
            validationErrors.password ? "border-red-300" : "border-gray-300"
          }`}
        />
        {validationErrors.password && (
          <div className="mt-1 text-sm text-red-600">
            {validationErrors.password}
          </div>
        )}
      </div>

      <div>
        <button
          type="submit"
          disabled={isLoading || authLoading}
          className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isLoading || authLoading ? "Logging in..." : "Login"}
        </button>
      </div>
      <div>
        ### Credentials
        <li>- Admin: admin@example.com / password</li>
        <li>- Customer: customer@example.com / password</li>
        <li>- Restaurant: restaurant@example.com / password</li>
        <li>- Driver: driver@example.com / password</li>
      </div>
    </form>
  );
};

export default LoginPage;
