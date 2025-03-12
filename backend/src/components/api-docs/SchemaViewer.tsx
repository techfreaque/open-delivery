"use client";

import type { JSX } from "react";

import type { ActiveApiEndpoint } from "@/lib/api-docs/endpoints";

interface SchemaViewerProps {
  endpoint: ActiveApiEndpoint;
}

export function SchemaViewer({ endpoint }: SchemaViewerProps): JSX.Element {
  return (
    <div className="space-y-4">
      {endpoint.endpoint.requestSchema && (
        <div>
          <h3 className="text-sm font-medium mb-2">Request Schema</h3>
          <div className="bg-gray-800 rounded-lg p-4">
            <pre className="text-green-400 font-mono text-sm overflow-auto">
              {JSON.stringify(endpoint.endpoint.requestSchema, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {endpoint.endpoint.responseSchema && (
        <div>
          <h3 className="text-sm font-medium mb-2 mt-4">Response Schema</h3>
          <div className="bg-gray-800 rounded-lg p-4">
            <pre className="text-green-400 font-mono text-sm overflow-auto">
              {JSON.stringify(endpoint.endpoint.responseSchema, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {!endpoint.endpoint.requestSchema &&
        !endpoint.endpoint.responseSchema && (
          <div className="text-gray-500 italic text-center py-4">
            No schema information available for this endpoint.
          </div>
        )}
    </div>
  );
}
