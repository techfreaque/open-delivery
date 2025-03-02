"use client";

import type { JSX } from "react";

import type { ApiEndpoint } from "@/types/types";

interface SchemaViewerProps {
  endpoint: ApiEndpoint;
}

export function SchemaViewer({ endpoint }: SchemaViewerProps): JSX.Element {
  return (
    <div className="space-y-4">
      {endpoint.requestSchema && (
        <div>
          <h3 className="text-sm font-medium mb-2">Request Schema</h3>
          <div className="bg-gray-800 rounded-lg p-4">
            <pre className="text-green-400 font-mono text-sm overflow-auto">
              {JSON.stringify(endpoint.requestSchema, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {endpoint.responseSchema && (
        <div>
          <h3 className="text-sm font-medium mb-2 mt-4">Response Schema</h3>
          <div className="bg-gray-800 rounded-lg p-4">
            <pre className="text-green-400 font-mono text-sm overflow-auto">
              {JSON.stringify(endpoint.responseSchema, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {!endpoint.requestSchema && !endpoint.responseSchema && (
        <div className="text-gray-500 italic text-center py-4">
          No schema information available for this endpoint.
        </div>
      )}
    </div>
  );
}
