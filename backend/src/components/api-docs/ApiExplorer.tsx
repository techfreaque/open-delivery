"use client";

import Link from "next/link";
import type { JSX } from "react";
import { useEffect, useState } from "react";

import { DomainSelector } from "@/components/api-docs/DomainSelector";
import { EndpointDetails } from "@/components/api-docs/EndpointDetails";
import { ENDPOINTS } from "@/components/api-docs/endpoints";
import { EndpointsList } from "@/components/api-docs/EndpointsList";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { APP_NAME, ENDPOINT_DOMAINS } from "@/constants";
import { getExampleForEndpoint } from "@/lib/examples/data";

export interface ApiExplorerProps {
  compact?: boolean;
  showAllEndpoints?: boolean;
}

export default function ApiExplorer({
  compact = false,
  showAllEndpoints = false,
}: ApiExplorerProps): JSX.Element {
  const [activeEndpoint, setActiveEndpoint] = useState(ENDPOINTS[0]);
  const [responseData, setResponseData] = useState<string>("");
  const [selectedDomain, setSelectedDomain] =
    useState<keyof typeof ENDPOINT_DOMAINS>("test");

  // Get example data for the current endpoint
  const exampleData = getExampleForEndpoint(activeEndpoint.path);
  const [requestData, setRequestData] = useState<string>(() => {
    return JSON.stringify(exampleData, null, 2);
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [responseStatus, setResponseStatus] = useState<number | null>(null);

  // Update request data when endpoint changes
  useEffect(() => {
    // Use example data based on the endpoint type
    const example = getExampleForEndpoint(activeEndpoint.path);
    setRequestData(JSON.stringify(example, null, 2));
    setResponseData("");
    setResponseStatus(null);
  }, [activeEndpoint]);

  const handleTryIt = async (): Promise<void> => {
    setIsLoading(true);
    setResponseData("");
    setResponseStatus(null);

    try {
      // Parse the request path and replace any path parameters
      let path = activeEndpoint.path;
      let parsedData: any = {};

      try {
        // Only parse request data if it's not empty
        if (requestData.trim() !== "{}") {
          parsedData = JSON.parse(requestData);
        }

        // Handle path parameters (replace {id} with actual values from request)
        if (path.includes("{")) {
          // Extract parameter name from the path
          const pathParams = path.match(/{([^}]+)}/g) || [];

          for (const param of pathParams) {
            const paramName = param.replace(/[{}]/g, "");
            if (parsedData[paramName]) {
              path = path.replace(param, parsedData[paramName]);
              // Remove used path parameters from the request body
              delete parsedData[paramName];
            } else {
              // If no matching parameter found, replace with a placeholder
              path = path.replace(param, "example-id");
            }
          }
        }
      } catch (error) {
        setResponseStatus(400);
        setResponseData(
          JSON.stringify({ error: "Invalid JSON in request body" }, null, 2),
        );
        setIsLoading(false);
        return;
      }

      // Use the selected domain
      const baseUrl = ENDPOINT_DOMAINS[selectedDomain];
      const url = `${baseUrl}${path}`;

      // Make the actual API call
      const response = await fetch(url, {
        method: activeEndpoint.method,
        headers: {
          "Content-Type": "application/json",
          // Add authorization header if the endpoint requires it
          ...(activeEndpoint.requiresAuth && {
            Authorization: `Bearer ${localStorage.getItem("authToken") || "YOUR_TOKEN_HERE"}`,
          }),
        },
        // Only include body for non-GET requests
        body:
          activeEndpoint.method !== "GET"
            ? JSON.stringify(parsedData)
            : undefined,
      });

      // Get the response status
      setResponseStatus(response.status);

      // Try to parse the response as JSON, fall back to text if needed
      try {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          setResponseData(JSON.stringify(data, null, 2));
        } else {
          const text = await response.text();
          setResponseData(text || "(Empty response)");
        }
      } catch (error) {
        setResponseData("(Unable to parse response)");
      }
    } catch (error) {
      setResponseStatus(500);
      setResponseData(
        JSON.stringify(
          {
            error: "Request failed",
            details: error instanceof Error ? error.message : String(error),
          },
          null,
          2,
        ),
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-8">
      <Card>
        <CardHeader>
          <CardTitle>API Documentation</CardTitle>
          <CardDescription>
            Explore our comprehensive API to integrate with the {APP_NAME}{" "}
            platform.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-6">
            Our RESTful API allows you to integrate with our platform. You can
            browse restaurants, menus, create orders and track deliveries
            programmatically.
          </p>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg">
              <div className="bg-blue-100 p-2 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-blue-600"
                >
                  <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
                  <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
                  <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">Authentication</h3>
                <p className="text-sm text-gray-600">
                  JWT-based secure API auth
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg">
              <div className="bg-green-100 p-2 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-green-600"
                >
                  <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
                  <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
                  <line x1="6" y1="6" x2="6.01" y2="6" />
                  <line x1="6" y1="18" x2="6.01" y2="18" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">RESTful Endpoints</h3>
                <p className="text-sm text-gray-600">
                  Clean and consistent API design
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg">
              <div className="bg-amber-100 p-2 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-amber-600"
                >
                  <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
                  <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">Webhooks</h3>
                <p className="text-sm text-gray-600">
                  Real-time event notifications
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center my-6">
            <h3 className="text-lg font-semibold">API Explorer</h3>
            {compact ? (
              <Link href="/v1/api-docs">
                <Button variant="outline" size="sm">
                  View Full Documentation
                </Button>
              </Link>
            ) : (
              <></>
            )}
          </div>

          <div className="border rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">API Testing</h3>
              <DomainSelector
                selectedDomain={selectedDomain}
                onDomainChange={setSelectedDomain}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Left panel with endpoints */}
              <div className="lg:col-span-1 space-y-3">
                <EndpointsList
                  activeEndpoint={activeEndpoint}
                  onEndpointChange={setActiveEndpoint}
                  compact={compact}
                  showAllEndpoints={showAllEndpoints}
                />
              </div>

              {/* Right panel with request/response/schema */}
              <div className="lg:col-span-2">
                <EndpointDetails
                  endpoint={activeEndpoint}
                  requestData={requestData}
                  responseData={responseData}
                  responseStatus={responseStatus}
                  isLoading={isLoading}
                  selectedDomain={selectedDomain}
                  handleTryIt={handleTryIt}
                  setRequestData={setRequestData}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
