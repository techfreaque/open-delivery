"use client";

import Link from "next/link";
import type { JSX } from "react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ENDPOINT_DOMAINS } from "@/constants";
import type { ApiEndpoint } from "@/types/types";

interface CodeExamplesProps {
  activeEndpoint: ApiEndpoint;
  selectedDomain: keyof typeof ENDPOINT_DOMAINS;
  requestData: string;
}

export function CodeExamples({
  activeEndpoint,
  selectedDomain,
  requestData,
}: CodeExamplesProps): JSX.Element {
  const [language, setLanguage] = useState("javascript");
  const examples = getCodeExamples(activeEndpoint, requestData, selectedDomain);
  return (
    <div className="space-y-6 p-4">
      <Tabs value={language} onValueChange={setLanguage} className="w-full">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="javascript">JavaScript</TabsTrigger>
          <TabsTrigger value="typescript">TypeScript</TabsTrigger>
          <TabsTrigger value="python">Python</TabsTrigger>
          <TabsTrigger value="curl">cURL</TabsTrigger>
        </TabsList>

        {/* JavaScript Example */}
        <TabsContent value="javascript">
          <div className="bg-gray-800 text-green-400 p-4 rounded-lg overflow-auto">
            <pre className="language-javascript">{examples.javascript}</pre>
          </div>
        </TabsContent>

        {/* TypeScript Example */}
        <TabsContent value="typescript">
          <div className="bg-gray-800 text-green-400 p-4 rounded-lg overflow-auto">
            <pre className="language-typescript">{examples.typescript}</pre>
          </div>
        </TabsContent>

        {/* Python Example */}
        <TabsContent value="python">
          <div className="bg-gray-800 text-green-400 p-4 rounded-lg overflow-auto">
            <pre className="language-python">{examples.python}</pre>
          </div>
        </TabsContent>

        {/* cURL Example */}
        <TabsContent value="curl">
          <div className="bg-gray-800 text-green-400 p-4 rounded-lg overflow-auto">
            <pre className="language-bash">{examples.curl}</pre>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-center mt-6">
        <Link href="/v1/api-docs">
          <Button>View Full Documentation</Button>
        </Link>
      </div>
    </div>
  );
}

function getMethodFunctionName(endpoint: ApiEndpoint): string {
  const resourceName =
    endpoint.path.split("/").pop()?.replace(/[{}]/g, "") || "resource";

  switch (endpoint.method) {
    case "GET":
      return `fetch${capitalize(resourceName)}`;
    case "POST":
      return `create${capitalize(resourceName)}`;
    case "PUT":
      return `update${capitalize(resourceName)}`;
    case "DELETE":
      return `delete${capitalize(resourceName)}`;
    case "PATCH":
      return `patch${capitalize(resourceName)}`;
    default:
      return `handle${capitalize(resourceName)}`;
  }
}

function getPythonFunctionName(endpoint: ApiEndpoint): string {
  const resourceName =
    endpoint.path.split("/").pop()?.replace(/[{}]/g, "") || "resource";

  switch (endpoint.method) {
    case "GET":
      return `get_${resourceName}`;
    case "POST":
      return `create_${resourceName}`;
    case "PUT":
      return `update_${resourceName}`;
    case "DELETE":
      return `delete_${resourceName}`;
    case "PATCH":
      return `patch_${resourceName}`;
    default:
      return `handle_${resourceName}`;
  }
}

function getTypeScriptInterface(endpoint: ApiEndpoint): string {
  if (!endpoint.requestSchema) {
    return "// No request schema defined";
  }

  return Object.entries(endpoint.requestSchema)
    .map(([key, value]) => {
      if (typeof value === "string") {
        return `${key}: string; // ${value}`;
      }
      return `${key}: any; // Define proper type`;
    })
    .join("\n  ");
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function getCodeExamples(
  endpoint: ApiEndpoint,
  requestData: string,
  selectedDomain: keyof typeof ENDPOINT_DOMAINS,
): {
  curl: string;
  javascript: string;
  typescript: string;
  python: string;
} {
  return {
    curl: `curl -X ${endpoint.method} \\
  '${ENDPOINT_DOMAINS[selectedDomain]}${endpoint.path}' \\
  -H 'Authorization: Bearer YOUR_TOKEN' \\
  -H 'Content-Type: application/json' \\${
    endpoint.method !== "GET"
      ? `
  -d '${requestData.replace(/\n/g, "\n  ")}'`
      : ""
  }`,
    javascript: `// ${endpoint.description}
async function ${getMethodFunctionName(endpoint)}() {
  const response = await fetch('${ENDPOINT_DOMAINS[selectedDomain]}${endpoint.path}', {
    method: '${endpoint.method}',
    headers: {
      'Authorization': 'Bearer YOUR_TOKEN',
      'Content-Type': 'application/json'
    }${
      endpoint.method !== "GET"
        ? `,
    body: JSON.stringify(${requestData})`
        : ""
    }
  });
  
  const data = await response.json();
  return data;
}`,
    typescript: `// ${endpoint.description}
interface RequestData {
  ${getTypeScriptInterface(endpoint)}
}

interface ResponseData {
  // Define your response type based on the endpoint
}

async function ${getMethodFunctionName(endpoint)}(${endpoint.method !== "GET" ? "data: RequestData" : ""}): Promise<ResponseData> {
  const response = await fetch('${ENDPOINT_DOMAINS[selectedDomain]}${endpoint.path}', {
    method: '${endpoint.method}',
    headers: {
      'Authorization': 'Bearer YOUR_TOKEN',
      'Content-Type': 'application/json'
    }${
      endpoint.method !== "GET"
        ? `,
    body: JSON.stringify(data)`
        : ""
    }
  });
  
  if (!response.ok) {
    throw new Error(\`HTTP error! Status: \${response.status}\`);
  }
  
  const responseData = await response.json();
  return responseData;
}`,
    python: `import requests

def ${getPythonFunctionName(endpoint)}():
    headers = {
        'Authorization': 'Bearer YOUR_TOKEN',
        'Content-Type': 'application/json'
    }
    
    ${
      endpoint.method !== "GET"
        ? `data = ${requestData}
    
    response = requests.${endpoint.method.toLowerCase()}('${ENDPOINT_DOMAINS[selectedDomain]}${endpoint.path}', headers=headers, json=data)`
        : `response = requests.get('${ENDPOINT_DOMAINS[selectedDomain]}${endpoint.path}', headers=headers)`
    }
    
    if response.status_code >= 400:
        raise Exception(f"HTTP error! Status: {response.status_code}")
    
    return response.json()`,
  };
}
