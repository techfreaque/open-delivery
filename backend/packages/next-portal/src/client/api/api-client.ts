import type {
  QueryKey,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import type { ApiEndpoint } from "../../api/endpoint";
import type {
  ErrorResponseType,
  ResponseType,
  SuccessResponseType,
} from "../../types/response.schema";
import { errorLogger } from "../../utils/logger";
import { getAuthToken } from "../auth/auth-client";
import {
  generateStorageKey,
  getStorageItem,
  setStorageItem,
} from "../storage/storage-client";

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
 * Enhanced query result with additional loading state info
 */
export type EnhancedQueryResult<
  TResponse,
  TError = unknown,
  TData = TResponse,
> = Omit<UseQueryResult<TData, TError>, "data"> & {
  data: TData;
  isLoadingFresh: boolean;
  isCachedData: boolean;
  statusMessage: string;
};

/**
 * Type for the API query options
 */
export interface ApiQueryOptions<TData = unknown, TError = Error>
  extends Omit<
    UseQueryOptions<TData, TError, TData>,
    "queryFn" | "initialData"
  > {
  enabled?: boolean;
  staleTime?: number;
  cacheTime?: number;
  refetchOnWindowFocus?: boolean;
  onSuccess?: (data: TData) => void;
  onError?: (error: TError) => void;
  disableLocalCache?: boolean; // Option to disable local caching
  cacheDuration?: number; // Override default cache duration in ms
}

/**
 * React Query hook for GET requests with local storage caching
 * @param queryKey - The React Query key for caching
 * @param endpoint - The endpoint to call
 * @param options - Query options
 * @returns Enhanced query result with extra loading state information
 */
export function useApiQuery<TRequest, TResponse, TUrlVariables>(
  endpoint: ApiEndpoint<TRequest, TResponse, TUrlVariables>,
  options: Omit<ApiQueryOptions<TResponse>, "queryKey"> & {
    queryKey?: QueryKey;
  } = {},
): EnhancedQueryResult<TResponse, Error> {
  const mergedOptions: ApiQueryOptions<TResponse> = {
    staleTime: 60000, // Default to 1 minute
    cacheTime: 600000, // Default to 10 minutes
    refetchOnWindowFocus: false,
    disableLocalCache: false,

    ...endpoint.apiQueryOptions,
    ...options,
  };
  // State to track initial loading vs refetching
  const [isLoadingFresh, setIsLoadingFresh] = useState<boolean>(true);
  const [isCachedData, setIsCachedData] = useState<boolean>(false);

  // State to hold initial data from cache
  const [initialData, setInitialData] = useState<TResponse | undefined>(
    undefined,
  );

  // Flag to indicate if we've loaded data from storage
  const [loadedFromStorage, setLoadedFromStorage] = useState<boolean>(false);

  // Effect to load data from storage on mount
  useEffect(() => {
    const loadInitialData = async (): Promise<void> => {
      if (options.disableLocalCache) {
        setLoadedFromStorage(true);
        return;
      }

      try {
        // Generate a consistent storage key from the query key
        const storageKey = generateStorageKey(mergedOptions.queryKey);

        // Attempt to load data from storage
        const storedData = await getStorageItem<TResponse>(storageKey);

        if (storedData) {
          setInitialData(storedData);
          setIsCachedData(true);
        }
      } catch (error) {
        // Keep console.error for error logging
        errorLogger("Failed to load data from storage:", error);
      } finally {
        setLoadedFromStorage(true);
      }
    };

    void loadInitialData();
  }, [options.disableLocalCache, mergedOptions.queryKey]);

  // Only proceed with React Query if we've checked storage first
  const query = useQuery<TResponse, Error>({
    queryKey: mergedOptions.queryKey,
    queryFn: async (
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
    ...options,
    // Only set enabled once we've loaded from storage and if user's enabled option is true/undefined
    enabled:
      loadedFromStorage &&
      (options.enabled === undefined ? true : options.enabled),
    // Use initialData if available
    initialData,
    onSuccess: (data: TResponse): void => {
      if (!options.disableLocalCache) {
        // Store successful response in local storage
        const storageKey = generateStorageKey(mergedOptions.queryKey);
        void setStorageItem<TResponse>(storageKey, data).catch((err) =>
          errorLogger("Failed to store API response in storage:", err),
        );
      }

      setIsLoadingFresh(false);
      setIsCachedData(false);

      // Call user-provided onSuccess if available
      if (options.onSuccess) {
        options.onSuccess(data);
      }
    },
  });

  // We're loading fresh data if we're loading and haven't fetched data yet,
  // or if we're refetching but had no initial data
  const computedIsLoadingFresh: boolean =
    (query.isLoading && !initialData) ||
    (query.isFetching && !query.data && isLoadingFresh);

  // Generate a human-readable status message
  let statusMessage: string = "Ready";
  if (computedIsLoadingFresh) {
    statusMessage = "Loading data...";
  } else if (query.isFetching) {
    statusMessage = "Refreshing data...";
  } else if (query.isError) {
    statusMessage = `Error: ${query.error.message}`;
  } else if (isCachedData && initialData) {
    statusMessage = "Showing cached data";
  }

  return {
    ...query,
    isLoadingFresh: computedIsLoadingFresh,
    isCachedData,
    statusMessage,
  } as unknown as EnhancedQueryResult<TResponse, Error>;
}

/**
 * Type for the API mutation options
 */
export interface ApiMutationOptions<TData = unknown, TVariables = unknown> {
  onSuccess?: (data: TData, variables: TVariables) => void | Promise<void>;
  onError?: (error: Error, variables: TVariables) => void | Promise<void>;
  invalidateQueries?: QueryKey;
  updateQueries?: Array<{
    queryKey: QueryKey;
    updater: <TOldData, TNewData extends TData>(
      oldData: TOldData,
      newData: TNewData,
    ) => TOldData;
  }>;
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
          options.invalidateQueries.map(async (queryKey) => {
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
