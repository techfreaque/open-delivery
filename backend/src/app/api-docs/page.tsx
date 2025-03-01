"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import * as React from "react";

import ApiEndpointExplorer from "@/components/api-docs/ApiEndpointExplorer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { endpoints } from "@/lib/api-docs/endpoints";
import type { ApiEndpoint } from "@/types/types";

interface ApiCategory {
  name: string;
  description: string;
  endpoints: ApiEndpoint[];
}

// Group endpoints by category
const categories: ApiCategory[] = [
  {
    name: "auth",
    description: "Authentication and user management endpoints",
    endpoints: endpoints.filter((endpoint) => endpoint.path.includes("/auth/")),
  },
  {
    name: "restaurants",
    description: "Restaurant management and menu endpoints",
    endpoints: endpoints.filter((endpoint) =>
      endpoint.path.includes("/restaurants/"),
    ),
  },
  {
    name: "orders",
    description: "Order processing and management endpoints",
    endpoints: endpoints.filter((endpoint) =>
      endpoint.path.includes("/orders/"),
    ),
  },
  {
    name: "delivery",
    description: "Delivery tracking and management endpoints",
    endpoints: endpoints.filter((endpoint) =>
      endpoint.path.includes("/delivery/"),
    ),
  },
  {
    name: "users",
    description: "User management endpoints",
    endpoints: endpoints.filter(
      (endpoint) =>
        endpoint.path.includes("/users/") ||
        (endpoint.path.includes("/api/") &&
          !endpoint.path.includes("/auth/") &&
          !endpoint.path.includes("/restaurants/") &&
          !endpoint.path.includes("/orders/") &&
          !endpoint.path.includes("/delivery/")),
    ),
  },
];

export default function Page(): React.JSX.Element {
  const router = useRouter();
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint | null>(
    null,
  );
  const [selectedCategory, setSelectedCategory] = useState<string>("auth");

  const handleSignOut = (): void => {
    // Clear the auth cookie
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
    router.push("/auth/login");
  };

  // Set the first endpoint as the default selected endpoint
  useEffect(() => {
    if (categories.length > 0 && categories[0].endpoints.length > 0) {
      setSelectedEndpoint(categories[0].endpoints[0]);
    }
  }, []);

  return (
    <main>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-primary">
              Open Delivery API Explorer
            </h1>
            <Button variant="outline" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </header>

        <div className="container mx-auto px-4 py-6">
          <div className="flex gap-6">
            {/* API Categories */}
            <div className="w-64">
              <div className="bg-white rounded-lg shadow p-4 mb-4">
                <h2 className="text-lg font-bold mb-4">API Categories</h2>
                <Tabs
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                  orientation="vertical"
                  className="w-full"
                >
                  <TabsList className="flex flex-col h-auto bg-muted/50">
                    {categories.map((category) => (
                      <TabsTrigger
                        key={category.name}
                        value={category.name}
                        className="w-full justify-start text-left px-3 py-2"
                      >
                        {category.name.charAt(0).toUpperCase() +
                          category.name.slice(1)}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>
            </div>

            {/* API Endpoints */}
            <div className="flex-1">
              <Tabs value={selectedCategory} className="w-full">
                {categories.map((category) => (
                  <TabsContent
                    key={category.name}
                    value={category.name}
                    className="mt-0"
                  >
                    <div className="bg-white rounded-lg shadow p-6 mb-6">
                      <h2 className="text-xl font-bold mb-2">
                        {category.name.charAt(0).toUpperCase() +
                          category.name.slice(1)}{" "}
                        API
                      </h2>
                      <p className="text-gray-600 mb-4">
                        {category.description}
                      </p>

                      <div className="grid grid-cols-1 gap-4">
                        {category.endpoints.map((endpoint, index) => (
                          <div
                            key={index}
                            className={`border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                              selectedEndpoint?.path === endpoint.path
                                ? "border-primary bg-primary/5"
                                : "border-gray-200"
                            }`}
                            onClick={() => setSelectedEndpoint(endpoint)}
                          >
                            <div className="flex items-center">
                              <span
                                className={`inline-block px-2 py-1 rounded text-xs font-bold mr-3 ${
                                  endpoint.method === "GET"
                                    ? "bg-green-100 text-green-800"
                                    : endpoint.method === "POST"
                                      ? "bg-blue-100 text-blue-800"
                                      : endpoint.method === "PUT"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : endpoint.method === "DELETE"
                                          ? "bg-red-100 text-red-800"
                                          : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {endpoint.method}
                              </span>
                              <span className="font-mono text-sm">
                                {endpoint.path}
                              </span>
                            </div>
                            <p className="mt-2 text-sm text-gray-600">
                              {endpoint.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* API Endpoint Explorer */}
                    {selectedEndpoint && (
                      <ApiEndpointExplorer endpoint={selectedEndpoint} />
                    )}
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
