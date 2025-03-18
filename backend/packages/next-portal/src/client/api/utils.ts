import type { UseMutationResult } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { ApiEndpoint } from "../../api/endpoint";
import type {
  ErrorResponseType,
  ResponseType,
  SuccessResponseType,
} from "../../types/response.schema";
import { errorLogger } from "../../utils/logger";
import { getAuthToken } from "../auth/auth-client";
import { generateStorageKey, setStorageItem } from "../storage/storage-client";
import type { ApiMutationOptions, ApiQueryOptions } from "./types";

// Type guard functions
function isSuccessResponse<T>(
  response: unknown,
): response is SuccessResponseType<T> {
  return (
    typeof response === "object" &&
    response !== null &&
    "success" in response &&
    (response as { success: unknown }).success === true &&
    "data" in response
  );
}

function isErrorResponse(response: unknown): response is ErrorResponseType {
  return (
    typeof response === "object" &&
    response !== null &&
    "success" in response &&
    (response as { success: unknown }).success === false &&
    "message" in response &&
    typeof (response as { message: unknown }).message === "string"
  );
}

/**
 * Core function to call an API endpoint
 * Handles request validation, authentication, and response parsing
 */
export async function callApi<TRequest, TResponse, TUrlVariables>(
  endpoint: ApiEndpoint<TRequest, TResponse, TUrlVariables>,
  endpointUrl: string,
  postBody: string | undefined,
): Promise<ResponseType<TResponse>> {
  try {
    // Prepare headers
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    // Add authentication header if required
    if (endpoint.requiresAuthentication()) {
      const token = await getAuthToken();
      if (!token) {
        return {
          success: false,
          message: "Authentication required but no token available",
        };
      }
      headers["Authorization"] = `Bearer ${token}`;
    }

    // Prepare request options
    const options: RequestInit = {
      method: endpoint.method,
      headers,
      credentials: "include", // Include cookies for session-based auth
    };

    // Add request body for non-GET requests
    if (endpoint.method !== "GET" && postBody) {
      options.body = postBody;
    }

    // Make the API call
    const response = await fetch(endpointUrl, options);
    const json = (await response.json()) as ResponseType<TResponse>;

    // Handle API response
    if (!response.ok) {
      const errorMessage = isErrorResponse(json)
        ? json.message
        : `API error: ${response.status} ${response.statusText}`;
      return {
        success: false,
        message: errorMessage,
      };
    }

    // Validate successful response against schema
    if (isSuccessResponse<unknown>(json)) {
      try {
        const validatedData = endpoint.responseSchema.parse(json.data);
        return {
          success: true,
          data: validatedData,
        } as SuccessResponseType<TResponse>;
      } catch (error) {
        return {
          success: false,
          message: `Response validation error: ${error instanceof Error ? error.message : "Unknown error"}`,
        };
      }
    } else {
      const errorMessage = isErrorResponse(json)
        ? json.message
        : "Unknown error";
      return {
        success: false,
        message: errorMessage,
      } as ErrorResponseType;
    }
  } catch (error) {
    return {
      success: false,
      message: `API request failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}

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
