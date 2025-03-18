import { zodResolver } from "@hookform/resolvers/zod";
import type { UseMutationResult } from "@tanstack/react-query";
import { useState } from "react";
import {
  useForm,
  type UseFormProps,
  type UseFormReturn,
} from "react-hook-form";
import type { z } from "zod";

import type { ApiEndpoint } from "../../api/endpoint";
import { parseError } from "../../utils/parse-error";
import type { ApiMutationOptions } from "./types";
import { useApiMutation } from "./use-api-mutation";

// Form-specific types
export type ApiFormOptions<TRequest> = Omit<
  UseFormProps<TRequest>,
  "resolver"
> & {
  defaultValues?: Partial<TRequest>;
};

export type ApiFormReturn<TRequest, TResponse> = UseFormReturn<TRequest> & {
  mutation: UseMutationResult<TResponse, Error, TRequest>;
  isSubmitting: boolean;
  submitForm: (data: TRequest) => Promise<TResponse | undefined>;
  formError: Error | null;
  clearFormError: () => void;
  setFormError: (error: Error | null) => void;
};

/**
 * Creates a form integrated with API mutation based on the endpoint's request schema
 * Works with both React and React Native
 */
export function useApiForm<TResponse, TRequest, TUrlVariables>(
  endpoint: ApiEndpoint<TRequest, TResponse, TUrlVariables>,
  options: ApiFormOptions<TRequest> = {},
  mutationOptions: ApiMutationOptions<TResponse, TRequest> = {},
): ApiFormReturn<TRequest, TResponse> {
  // Extract the request schema and create a resolver for React Hook Form
  const requestSchema = endpoint.requestSchema;

  // Initialize the form with zodResolver for validation
  const formMethods = useForm<TRequest>({
    resolver: requestSchema ? zodResolver(requestSchema) : undefined,
    defaultValues: options.defaultValues,
    ...options,
  });

  // Create the mutation
  const mutation = useApiMutation<TResponse, TRequest, TUrlVariables>(
    endpoint,
    mutationOptions,
  );

  // Track form error state
  const [formError, setFormError] = useState<Error | null>(null);

  // Clear form error helper
  const clearFormError = (): void => setFormError(null);

  // Create a submit handler that validates and submits the form
  const submitForm = async (
    data: TRequest | undefined,
  ): Promise<TResponse | undefined> => {
    clearFormError();
    try {
      // For GET requests without a body, pass undefined directly to mutateAsync
      // For other requests, use the provided data
      return await mutation.mutateAsync(data);
    } catch (error) {
      const parsedError = parseError(error);
      setFormError(parsedError);
      return undefined;
    }
  };

  // Return combined form methods, mutation, and submission utilities
  return {
    ...formMethods,
    mutation,
    isSubmitting: mutation.isPending,
    submitForm,
    formError,
    clearFormError,
    setFormError,
  };
}

/**
 * Creates a form schema based on the endpoint's request schema
 * Useful for building custom forms
 */
export function getFormSchema<TRequest>(
  endpoint: ApiEndpoint<TRequest, unknown, unknown>,
): z.ZodType<TRequest> | undefined {
  return endpoint.requestSchema as z.ZodType<TRequest> | undefined;
}
