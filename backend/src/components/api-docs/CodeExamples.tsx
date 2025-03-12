"use client";

import type { JSX } from "react";
import { useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ENDPOINT_DOMAINS } from "@/constants";
import type { ActiveApiEndpoint } from "@/lib/api-docs/endpoints";

interface CodeExamplesProps {
  activeEndpoint: ActiveApiEndpoint;
  selectedDomain: keyof typeof ENDPOINT_DOMAINS;
}

export function CodeExamples({
  activeEndpoint,
  selectedDomain,
}: CodeExamplesProps): JSX.Element {
  const [activeLanguage, setActiveLanguage] = useState("curl");

  // Available languages for code examples
  const languages = {
    curl: "cURL",
    javascript: "JavaScript",
    python: "Python",
    php: "PHP",
  };

  // Generate code examples for different languages
  const generateExample = (language: string, domain: string): string => {
    const path = activeEndpoint.path;
    const method = activeEndpoint.method;
    const hasBody = method !== "GET" && method !== "DELETE";

    // Choose an example - either use default or the first available
    const example =
      activeEndpoint.endpoint.examples?.default ||
      (activeEndpoint.endpoint.examples &&
        Object.values(activeEndpoint.endpoint.examples)[0]);

    switch (language) {
      case "curl":
        return `curl -X ${method} "${domain}${path}" \\
${
  hasBody
    ? `-H "Content-Type: application/json" \\
-d '${JSON.stringify(example, null, 2)}' \\`
    : ""
}
${activeEndpoint.endpoint.requiresAuth ? `-H "Authorization: Bearer YOUR_TOKEN_HERE" \\` : ""}
-H "Accept: application/json"`;

      case "javascript":
        return `// Using fetch API
const response = await fetch("${domain}${path}", {
  method: "${method}",
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
    ${activeEndpoint.endpoint.requiresAuth ? `"Authorization": "Bearer YOUR_TOKEN_HERE",` : ""}
  },
  ${hasBody ? `body: JSON.stringify(${JSON.stringify(example, null, 2)})` : ""}
});

const data = await response.json();
console.log(data);`;

      case "python":
        return `import requests

url = "${domain}${path}"
headers = {
    "Accept": "application/json",
    ${activeEndpoint.endpoint.requiresAuth ? `"Authorization": "Bearer YOUR_TOKEN_HERE",` : ""}
    ${hasBody ? `"Content-Type": "application/json"` : ""}
}
${
  hasBody
    ? `payload = ${JSON.stringify(example, null, 2)}

response = requests.${method.toLowerCase()}(url, json=payload, headers=headers)`
    : `
response = requests.${method.toLowerCase()}(url, headers=headers)`
}
data = response.json()
print(data)`;

      case "php":
        return `<?php
$url = "${domain}${path}";

$options = [
    'http' => [
        'header' => "Accept: application/json\\r\\n" . 
                    ${activeEndpoint.endpoint.requiresAuth ? `"Authorization: Bearer YOUR_TOKEN_HERE\\r\\n" .` : ""} 
                    ${hasBody ? `"Content-Type: application/json\\r\\n",` : `",`}
        'method' => "${method}",
        ${hasBody ? `'content' => '${JSON.stringify(example)}'` : ""}
    ]
];

$context = stream_context_create($options);
$result = file_get_contents($url, false, $context);
$response = json_decode($result, true);

print_r($response);
?>`;

      default:
        return "// Example code generation not available for this language";
    }
  };

  // Get available tabs based on examples
  const availableExamples = Object.keys(activeEndpoint.endpoint.examples || {});
  const defaultTab =
    availableExamples.length > 0 ? availableExamples[0] : "default";

  return (
    <div className="p-4">
      <div className="mb-6">
        <h3 className="text-sm font-medium mb-2">Code Examples</h3>
        <p className="text-xs text-gray-500">
          Use these code examples to integrate with our API
        </p>
      </div>

      <Tabs value={activeLanguage} onValueChange={setActiveLanguage}>
        <TabsList className="mb-4">
          {Object.entries(languages).map(([key, label]) => (
            <TabsTrigger key={key} value={key} className="text-xs">
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.keys(languages).map((key) => (
          <TabsContent key={key} value={key}>
            <div className="bg-gray-800 rounded-lg p-4 relative">
              <div className="absolute top-2 right-2 text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                {key}
              </div>
              <pre className="text-green-400 font-mono text-sm overflow-auto max-h-[400px]">
                {generateExample(key, selectedDomain)}
              </pre>
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {availableExamples.length > 1 && (
        <div className="mt-6">
          <h4 className="text-sm font-medium mb-2">Alternative Examples</h4>
          <Tabs defaultValue={defaultTab}>
            <TabsList className="mb-4">
              {availableExamples.map((example) => (
                <TabsTrigger key={example} value={example} className="text-xs">
                  {example}
                </TabsTrigger>
              ))}
            </TabsList>

            {availableExamples.map((example) => (
              <TabsContent key={example} value={example}>
                <div className="bg-gray-50 rounded-lg p-4 border">
                  <pre className="text-sm overflow-auto max-h-[200px]">
                    {JSON.stringify(
                      activeEndpoint.endpoint.examples?.[example],
                      null,
                      2,
                    )}
                  </pre>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      )}
    </div>
  );
}
