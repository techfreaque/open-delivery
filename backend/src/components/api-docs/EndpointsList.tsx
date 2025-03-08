"use client";

import Link from "next/link";
import type { JSX } from "react";
import { useMemo } from "react";

import { ENDPOINTS } from "@/components/api-docs/endpoints";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { ApiEndpoint } from "@/types/types";

interface EndpointsListProps {
  activeEndpoint: ApiEndpoint;
  onEndpointChange: (endpoint: ApiEndpoint) => void;
  compact?: boolean;
  displayEndpoints?: ApiEndpoint[];
}

export function EndpointsList({
  activeEndpoint,
  onEndpointChange,
  compact = false,
  displayEndpoints,
}: EndpointsListProps): JSX.Element {
  // Group endpoints by their base path
  const groupedEndpoints = useMemo(() => {
    const groups: Record<string, ApiEndpoint[]> = {};

    ENDPOINTS.forEach((endpoint) => {
      // Get the base path (e.g., /api/v1/restaurants from /api/v1/restaurants/{id})
      const basePath = endpoint.path.split("/").slice(0, 4).join("/");

      if (!groups[basePath]) {
        groups[basePath] = [];
      }

      groups[basePath].push(endpoint);
    });

    return groups;
  }, []);

  // Display endpoints - either all or a limited number based on compact mode
  const endpointsToShow = useMemo(() => {
    if (displayEndpoints) {
      return displayEndpoints;
    }

    if (!compact) {
      return ENDPOINTS;
    }
    return compact ? ENDPOINTS.slice(0, 5) : ENDPOINTS;
  }, [compact, displayEndpoints]);

  return (
    <div className="space-y-6">
      <div className="font-medium text-sm mb-4">API Endpoints</div>

      {/* Endpoint groups */}
      {Object.entries(groupedEndpoints).map(([basePath, endpoints]) => {
        // Skip if none of the endpoints in this group should be displayed
        if (!endpoints.some((e) => endpointsToShow.includes(e))) {
          return null;
        }

        const displayedEndpoints = endpoints.filter((e) =>
          endpointsToShow.includes(e),
        );
        if (displayedEndpoints.length === 0) {
          return null;
        }

        return (
          <div key={basePath} className="mb-6">
            <div className="text-xs uppercase tracking-wider text-gray-500 mb-2">
              {basePath.split("/").pop()}
            </div>
            <div className="space-y-2">
              {displayedEndpoints.map((endpoint) => (
                <Card
                  key={`${endpoint.method}-${endpoint.path}`}
                  className={`p-3 border cursor-pointer hover:border-primary/50 transition-colors ${
                    activeEndpoint.method === endpoint.method &&
                    activeEndpoint.path === endpoint.path
                      ? "border-primary ring-1 ring-primary bg-primary/5"
                      : ""
                  }`}
                  onClick={() => onEndpointChange(endpoint)}
                >
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-xs px-2 py-1 rounded font-medium ${
                        endpoint.method === "GET"
                          ? "bg-green-100 text-green-700"
                          : endpoint.method === "POST"
                            ? "bg-blue-100 text-blue-700"
                            : endpoint.method === "PUT"
                              ? "bg-yellow-100 text-yellow-700"
                              : endpoint.method === "DELETE"
                                ? "bg-red-100 text-red-700"
                                : "bg-purple-100 text-purple-700"
                      }`}
                    >
                      {endpoint.method}
                    </span>
                    <span className="text-sm font-mono truncate">
                      {endpoint.path}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    {endpoint.description}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        );
      })}

      {compact && endpointsToShow.length < ENDPOINTS.length && (
        <div className="pt-4">
          <Link href="/v1/api-docs">
            <Button variant="outline" size="sm" className="w-full">
              View All Endpoints
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
