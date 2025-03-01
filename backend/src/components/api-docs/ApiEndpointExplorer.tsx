"use client";

import { useState } from "react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ApiEndpoint } from "@/types/types";

interface ApiEndpointExplorerProps {
  endpoint: ApiEndpoint;
}

export function ApiEndpointExplorer({
  endpoint,
}: ApiEndpointExplorerProps): React.ReactElement {
  const [requestData, setRequestData] = useState<string>(
    endpoint.requestSchema
      ? JSON.stringify(endpoint.requestSchema, null, 2)
      : "{}",
  );
  const [responseData, setResponseData] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<string>("explorer");

  const handleRequestSubmit = async (): Promise<void> => {
    if (!endpoint) {
      return;
    }

    setIsLoading(true);
    setResponseData("");
    setResponseStatus(null);

    try {
      let parsedData = {};
      try {
        parsedData = JSON.parse(requestData);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        // Handle JSON parse error
        setResponseData(
          JSON.stringify({ error: "Invalid JSON in request" }, null, 2),
        );
        setResponseStatus(400);
        return;
      }

      const response = await fetch(endpoint.path, {
        method: endpoint.method,
        headers: {
          "Content-Type": "application/json",
        },
        body:
          endpoint.method !== "GET" ? JSON.stringify(parsedData) : undefined,
      });

      const data = await response.json();
      setResponseStatus(response.status);
      setResponseData(JSON.stringify(data, null, 2));
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // Handle fetch error
      setResponseStatus(500);
      setResponseData(
        JSON.stringify(
          { error: "An error occurred while making the request" },
          null,
          2,
        ),
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold flex items-center">
            <span
              className={`inline-block px-3 py-1 rounded text-sm font-bold mr-3 ${
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
            <span className="font-mono">{endpoint.path}</span>
          </h2>
          <p className="text-gray-600 mt-1">{endpoint.description}</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="explorer">Explorer</TabsTrigger>
          <TabsTrigger value="documentation">Documentation</TabsTrigger>
        </TabsList>

        {/* Explorer Tab */}
        <TabsContent value="explorer">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Request section */}
            <div>
              <h3 className="text-lg font-bold mb-2">Request</h3>
              <div className="bg-gray-800 rounded-lg p-4 mb-4 relative">
                <div className="absolute top-2 right-2 text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                  JSON
                </div>
                <textarea
                  className="w-full h-80 bg-gray-800 text-green-400 font-mono p-2 focus:outline-none resize-none"
                  value={requestData}
                  onChange={(e) => setRequestData(e.target.value)}
                ></textarea>
              </div>
              <Button
                className={`w-full ${
                  isLoading
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-primary hover:bg-primary-dark"
                }`}
                onClick={() => void handleRequestSubmit()}
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send Request"}
              </Button>
            </div>

            {/* Response section */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-bold">Response</h3>
                {responseStatus !== null && (
                  <span
                    className={`px-2 py-1 rounded text-xs font-bold ${
                      responseStatus >= 200 && responseStatus < 300
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    Status: {responseStatus}
                  </span>
                )}
              </div>
              <pre className="bg-gray-800 rounded-lg p-4 text-green-400 font-mono h-80 overflow-auto relative">
                <div className="absolute top-2 right-2 text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                  JSON
                </div>
                {responseData ||
                  "// Response will appear here after sending a request"}
              </pre>
            </div>
          </div>
        </TabsContent>

        {/* Documentation Tab */}
        <TabsContent value="documentation">
          <div className="space-y-6">
            {/* Parameters */}
            <div>
              <h3 className="text-lg font-bold mb-2">Parameters</h3>
              {endpoint.requestSchema ? (
                <div>
                  <div className="bg-gray-50 rounded-lg p-4 border">
                    <h4 className="font-bold mb-2 text-sm">Request Schema</h4>
                    <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
                      {JSON.stringify(endpoint.requestSchema, null, 2)}
                    </pre>
                  </div>
                  <div className="mt-4">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Field
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Type
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Required
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Description
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {Object.entries(endpoint.requestSchema).map(
                          ([key, value]) => (
                            <tr key={key}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {key}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {typeof value === "object"
                                  ? "object"
                                  : typeof value}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {endpoint.requiredFields?.includes(key) ? (
                                  <span className="text-red-500">Yes</span>
                                ) : (
                                  <span>No</span>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {endpoint.fieldDescriptions?.[key] || "-"}
                              </td>
                            </tr>
                          ),
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 italic">No parameters required</p>
              )}
            </div>

            {/* Response */}
            <div>
              <h3 className="text-lg font-bold mb-2">Response</h3>
              {endpoint.responseSchema ? (
                <div className="bg-gray-50 rounded-lg p-4 border">
                  <h4 className="font-bold mb-2 text-sm">Response Schema</h4>
                  <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
                    {JSON.stringify(endpoint.responseSchema, null, 2)}
                  </pre>
                </div>
              ) : (
                <p className="text-gray-500 italic">
                  Response schema not documented
                </p>
              )}
            </div>

            {/* Authentication */}
            <div>
              <h3 className="text-lg font-bold mb-2">Authentication</h3>
              <p className="text-gray-600">
                {endpoint.requiresAuth
                  ? "This endpoint requires authentication. Include a valid JWT token in the Authorization header."
                  : "This endpoint does not require authentication."}
              </p>
            </div>

            {/* Error Codes */}
            {endpoint.errorCodes && (
              <div>
                <h3 className="text-lg font-bold mb-2">Error Codes</h3>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Description
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {Object.entries(endpoint.errorCodes).map(
                      ([code, description]) => (
                        <tr key={code}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {code}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {description}
                          </td>
                        </tr>
                      ),
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default ApiEndpointExplorer;
