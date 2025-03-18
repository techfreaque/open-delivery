import type { UseMutationResult } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type UseFormProps, type UseFormReturn } from "react-hook-form";

import type { ApiEndpoint } from "../../api/endpoint";
import { errorLogger } from "../../utils/logger";
import { generateStorageKey, setStorageItem } from "../storage/storage-client";
import type { ApiMutationOptions, ApiQueryOptions } from "./types";
import { callApi } from "./utils";

/**
 * React Query hook for mutation requests (POST, PUT, DELETE, etc.)
 * @param activeEndpoint - The endpoint to call
 * @param options - Mutation options
 * @returns Mutation result
 */
export function useApiMutation<TResponse, TRequest, TUrlVariables>(
  endpoint: ApiEndpoint<TRequest, TResponse, TUrlVariables>,
  options: ApiMutationOptions<TResponse, TRequest> = {},
): UseMutationResult<TResponse, Error, TRequest, unknown> {
  const mergedOptions: ApiQueryOptions<TResponse> = {
    staleTime: 60000, // Default to 1 minute
    cacheTime: 600000, // Default to 10 minutes
    refetchOnWindowFocus: false,
    disableLocalCache: false,

    ...endpoint.apiQueryOptions,
    ...options,
  };
  const queryClient = useQueryClient();

  return useMutation<TResponse, Error, TRequest, unknown>({
    mutationFn: async (
      requestData?: TRequest,
      pathParams?: TUrlVariables,
    ): Promise<TResponse> => {
      const { endpointUrl, postBody, success, message } =
        endpoint.getRequestData({
          requestData,
          pathParams,
        });
      if (!success) {
        throw new Error(message);
      }
      const response = await callApi<TRequest, TResponse, TUrlVariables>(
        endpoint,
        endpointUrl,
        postBody,
      );
      if (!response.success) {
        throw new Error(response.message);
      }
      return response.data;
    },
    onSuccess: async (data: TResponse, variables: TRequest): Promise<void> => {
      // Optimistic updates if defined
      if (options.updateQueries) {
        options.updateQueries.forEach(({ queryKey, updater }) => {
          queryClient.setQueryData(queryKey, (oldData: unknown) => {
            if (oldData) {
              const newData = updater(oldData, data);

              // Also update storage
              const storageKey = generateStorageKey(queryKey);
              void setStorageItem(storageKey, newData).catch((error) =>
                errorLogger("Failed to store updated data in storage:", error),
              );

              return newData;
            }
            return oldData;
          });
        });
      }

      // Invalidate queries if specified
      if (options.invalidateQueries) {
        await Promise.all(
          options.invalidateQueries.map(async () => {
            await queryClient.invalidateQueries({
              queryKey: mergedOptions.queryKey,
            });
          }),
        );
      }

      // Call custom onSuccess handler if provided
      if (options.onSuccess) {
        await options.onSuccess(data, variables);
      }
    },
    onError: async (error: Error, variables: TRequest): Promise<void> => {
      if (options.onError) {
        await options.onError(error, variables);
      }
    },
  });
}

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
};
