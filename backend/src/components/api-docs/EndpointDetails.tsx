"use client";

import type { JSX } from "react";
import { useState } from "react";

import { CodeExamples } from "@/components/api-docs/CodeExamples";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ActiveApiEndpoint } from "@/lib/api-docs/endpoints";

interface EndpointDetailsProps {
  endpoint: ActiveApiEndpoint;
  requestData: string;
  responseData: string;
  responseStatus: number | null;
  isLoading: boolean;
  selectedDomain: string;
  handleTryIt: () => Promise<void>;
  setRequestData: (data: string) => void;
}

export function EndpointDetails({
  endpoint, // Using correct prop name
  requestData,
  responseData,
  responseStatus,
  isLoading,
  selectedDomain,
  handleTryIt,
  setRequestData,
}: EndpointDetailsProps): JSX.Element {
  const [activeTab, setActiveTab] = useState("try-it");

  return (
    <div className="border rounded-md overflow-hidden">
      <div className="bg-gray-50 px-4 py-3 border-b">
        <div className="flex items-center justify-between mb-2">
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
            <span className="font-mono text-sm">{endpoint.path.join("/")}</span>
          </div>
          {endpoint.endpoint.requiresAuth && (
            <span className="text-xs bg-gray-200 px-2 py-1 rounded">
              🔒 Auth Required
            </span>
          )}
        </div>
        <p className="text-sm text-gray-600">{endpoint.endpoint.description}</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="try-it">Try It</TabsTrigger>
          <TabsTrigger value="examples">Code Examples</TabsTrigger>
          <TabsTrigger value="schema">Schema</TabsTrigger>
        </TabsList>

        <TabsContent value="try-it">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
            {/* Request panel */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium">Request</h3>
                <div className="text-xs px-2 py-1 bg-gray-100 rounded">
                  {endpoint.method} {endpoint.path}
                </div>
              </div>
              <div className="bg-gray-800 rounded-lg p-4 mb-4 relative min-h-[200px]">
                <div className="absolute top-2 right-2 text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                  JSON
                </div>
                <textarea
                  className="w-full h-full min-h-[150px] bg-gray-800 text-green-400 font-mono p-2 focus:outline-none resize-none"
                  value={requestData}
                  onChange={(e) => setRequestData(e.target.value)}
                  spellCheck="false"
                ></textarea>
              </div>
              <Button
                className="w-full"
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                onClick={handleTryIt}
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Try It"}
              </Button>
            </div>

            {/* Response panel */}
            <div>
              <div className="flex justify-between mb-2">
                <h3 className="text-sm font-medium">Response</h3>
                {responseStatus && (
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      responseStatus >= 200 && responseStatus < 300
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {responseStatus}{" "}
                    {responseStatus >= 200 && responseStatus < 300
                      ? "OK"
                      : "Error"}
                  </span>
                )}
              </div>
              <div className="bg-gray-800 rounded-lg p-4 relative min-h-[200px]">
                <div className="absolute top-2 right-2 text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                  JSON
                </div>
                <pre className="text-green-400 font-mono h-full overflow-auto max-h-[200px]">
                  {responseData || "// Response will appear here"}
                </pre>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="examples">
          <CodeExamples
            activeEndpoint={endpoint}
            selectedDomain={selectedDomain}
          />
        </TabsContent>

        <TabsContent value="schema">
          <div className="p-4">
            <h3 className="font-medium mb-4">Endpoint Schema</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Request Schema</h4>
                <div className="bg-gray-50 p-4 rounded-lg border">
                  {endpoint.endpoint.requestSchema ? (
                    <pre className="text-sm overflow-auto max-h-[300px]">
                      {JSON.stringify(endpoint.endpoint.requestSchema, null, 2)}
                    </pre>
                  ) : (
                    <p className="text-gray-500 text-sm">
                      No request schema defined
                    </p>
                  )}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">Response Schema</h4>
                <div className="bg-gray-50 p-4 rounded-lg border">
                  {endpoint.endpoint.responseSchema ? (
                    <pre className="text-sm overflow-auto max-h-[300px]">
                      {JSON.stringify(
                        endpoint.endpoint.responseSchema,
                        null,
                        2,
                      )}
                    </pre>
                  ) : (
                    <p className="text-gray-500 text-sm">
                      No response schema defined
                    </p>
                  )}
                </div>
              </div>
            </div>

            {endpoint.endpoint.errorCodes &&
              Object.keys(endpoint.endpoint.errorCodes).length > 0 && (
                <div className="mt-6">
                  <h4 className="text-sm font-medium mb-2">Error Codes</h4>
                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr>
                          <th className="text-left font-medium py-2">
                            Status Code
                          </th>
                          <th className="text-left font-medium py-2">
                            Description
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(endpoint.endpoint.errorCodes).map(
                          ([code, description]) => (
                            <tr key={code} className="border-t border-gray-200">
                              <td className="py-2">{code}</td>
                              <td className="py-2">{description}</td>
                            </tr>
                          ),
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
