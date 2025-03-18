import { type QueryKey, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import type { ApiEndpoint } from "../../api/endpoint";
import { errorLogger } from "../../utils/logger";
import {
  generateStorageKey,
  getStorageItem,
  setStorageItem,
} from "../storage/storage-client";
import type { ApiQueryOptions, EnhancedQueryResult } from "./types";
import { callApi } from "./utils";

/**
 * React Query hook for GET requests with local storage caching
 * @param queryKey - The React Query key for caching
 * @param endpoint - The endpoint to call
 * @param options - Query options
 * @returns Enhanced query result with extra loading state information
 */
export function useApiQuery<TRequest, TResponse, TUrlVariables>(
  endpoint: ApiEndpoint<TRequest, TResponse, TUrlVariables>,
  requestData: TRequest,
  pathParams: TUrlVariables,
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
    queryFn: async (): Promise<TResponse> => {
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
    ...mergedOptions,
    // Only set enabled once we've loaded from storage and if user's enabled option is true/undefined
    enabled:
      loadedFromStorage &&
      (options.enabled === undefined ? true : options.enabled),
    // Use initialData if available
    initialData,
  });

  useEffect(() => {
    if (query.isSuccess && !options.disableLocalCache) {
      const storageKey = generateStorageKey(mergedOptions.queryKey);
      void setStorageItem<TResponse>(storageKey, query.data).catch((err) =>
        errorLogger("Failed to store API response in storage:", err),
      );
    }

    if (query.isSuccess) {
      setIsLoadingFresh(false);
      setIsCachedData(false);

      if (options.onSuccess) {
        options.onSuccess(query.data);
      }
    }
  }, [
    query.isSuccess,
    query.data,
    options.disableLocalCache,
    options.onSuccess,
    mergedOptions.queryKey,
    options,
  ]);

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
  };
}
