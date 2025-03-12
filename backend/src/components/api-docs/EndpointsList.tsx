"use client";

import { ChevronDown, ChevronRight } from "lucide-react";
import type { JSX } from "react";
import { useState } from "react";

import { type ActiveApiEndpoint, apiDocsData } from "@/lib/api-docs/endpoints";
import { errorLogger } from "@/lib/utils";

interface EndpointData {
  description?: string;
  summary?: string;
  parameters?: Array<{
    name: string;
    in: string;
    required?: boolean;
    description?: string;
    schema?: Record<string, unknown>;
  }>;
  requestBody?: {
    content?: Record<string, { schema?: Record<string, unknown> }>;
    required?: boolean;
    description?: string;
  };
  responses?: Record<
    string,
    {
      description?: string;
      content?: Record<string, { schema?: Record<string, unknown> }>;
    }
  >;
  tags?: string[];
  operationId?: string;
  [key: string]:
    | string
    | string[]
    | boolean
    | undefined
    | Record<string, unknown>
    | Array<{ [key: string]: unknown }>;
}

interface ApiSection {
  [key: string]: ApiSection | EndpointData;
}

interface EndpointsListProps {
  activeEndpoint: ActiveApiEndpoint;
  onEndpointChange: (path: string[]) => void;
  compact?: boolean;
}

export function EndpointsList({
  activeEndpoint,
  onEndpointChange,
  compact = false,
}: EndpointsListProps): JSX.Element {
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    auth: true, // Default expanded sections
  });

  // Get all endpoints from the API docs data
  const endpointsData = apiDocsData.endpoints as ApiSection;

  // Toggle section expansion
  const toggleSection = (section: string): void => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Helper to check if a string is an HTTP method
  const isHttpMethod = (str: string): boolean => {
    return ["GET", "POST", "PUT", "DELETE", "PATCH"].includes(
      str.toUpperCase(),
    );
  };

  // Helper to get the current section from the nested structure
  const getCurrentSection = (
    data: ApiSection,
    path: string[],
  ): ApiSection | EndpointData | null => {
    let current: ApiSection | EndpointData = data;
    for (const segment of path) {
      if (!current[segment]) {
        return null;
      }
      current = current[segment] as ApiSection | EndpointData;
    }
    return current;
  };

  // Check if a section is part of the active path
  const isActiveSection = (sectionPath: string[]): boolean => {
    if (sectionPath.length > activeEndpoint.path.length) {
      return false;
    }

    for (let i = 0; i < sectionPath.length; i++) {
      if (sectionPath[i] !== activeEndpoint.path[i]) {
        return false;
      }
    }

    return true;
  };

  // Format section name for display
  const formatSectionName = (name: string): string => {
    return (
      name.charAt(0).toUpperCase() + name.slice(1).replace(/([A-Z])/g, " $1")
    );
  };

  // Get endpoint description
  const getEndpointDescription = (path: string[], method: string): string => {
    try {
      const sectionData = getCurrentSection(endpointsData, path);
      if (
        sectionData &&
        typeof sectionData === "object" &&
        method in sectionData
      ) {
        const methodData = sectionData[method] as EndpointData;
        return methodData.description || path.join("/");
      }
      return path.join("/");
    } catch (e) {
      errorLogger("Error getting endpoint description", e);
      return path.join("/");
    }
  };

  // Get color based on HTTP method
  const getMethodColor = (method: string): string => {
    switch (method.toUpperCase()) {
      case "GET":
        return "text-green-600";
      case "POST":
        return "text-blue-600";
      case "PUT":
        return "text-yellow-600";
      case "DELETE":
        return "text-red-600";
      case "PATCH":
        return "text-purple-600";
      default:
        return "text-gray-600";
    }
  };

  // Render a specific endpoint (HTTP method)
  const renderEndpoint = (
    method: string,
    path: string[],
  ): JSX.Element | null => {
    const fullPath = [...path, method];
    const isActive = activeEndpoint.fullPath.join("/") === fullPath.join("/");

    return (
      <div
        key={`${path.join("-")}-${method}`}
        className={`py-1 px-2 text-xs cursor-pointer rounded ${
          isActive ? "bg-blue-100 text-blue-700" : "hover:bg-gray-50"
        }`}
        onClick={() => onEndpointChange(fullPath)}
      >
        <div className="flex items-center">
          <span className={`font-mono ${getMethodColor(method)}`}>
            {method}
          </span>
          <span className="ml-2">{getEndpointDescription(path, method)}</span>
        </div>
      </div>
    );
  };

  // Render a section with its endpoints
  const renderSection = (
    section: string,
    path: string[] = [],
  ): JSX.Element | null => {
    const currentPath = [...path, section];
    const currentSection = getCurrentSection(endpointsData, currentPath);

    if (!currentSection) {
      return null;
    }

    const isEndpointGroup = !isHttpMethod(section);
    const isExpanded = expandedSections[section] || false;

    // Check if this is a leaf endpoint or a group
    const isLeaf =
      isHttpMethod(section) || Object.keys(currentSection).some(isHttpMethod);

    if (isLeaf && !isHttpMethod(section)) {
      // This is a leaf section with HTTP methods
      return (
        <div key={section} className="mb-2">
          <div
            className={`flex items-center justify-between py-2 px-2 text-sm cursor-pointer ${
              currentPath.join("/") === activeEndpoint.path.join("/")
                ? "bg-gray-100 rounded"
                : ""
            }`}
            onClick={() => toggleSection(section)}
          >
            <div className="flex items-center">
              {isExpanded ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
              <span className="ml-1 font-medium">
                {formatSectionName(section)}
              </span>
            </div>
          </div>

          {isExpanded && (
            <div className="ml-4 mt-1 space-y-1">
              {Object.keys(currentSection)
                .filter(isHttpMethod)
                .map((method) => renderEndpoint(method, [...currentPath]))}
            </div>
          )}
        </div>
      );
    }

    if (isEndpointGroup) {
      // This is a group of endpoints or nested groups
      return (
        <div key={section} className="mb-2">
          <div
            className={`flex items-center justify-between py-2 px-2 text-sm cursor-pointer ${
              isActiveSection(currentPath) ? "bg-gray-100 rounded" : ""
            }`}
            onClick={() => toggleSection(section)}
          >
            <div className="flex items-center">
              {isExpanded ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
              <span className="ml-1 font-medium">
                {formatSectionName(section)}
              </span>
            </div>
          </div>

          {isExpanded && (
            <div className="ml-4 mt-1 space-y-1">
              {Object.keys(currentSection).map((subSection) => {
                return isHttpMethod(subSection)
                  ? renderEndpoint(subSection, currentPath)
                  : renderSection(subSection, currentPath);
              })}
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  // Get root sections to render
  const rootSections = Object.keys(endpointsData).filter((section) => {
    // If in compact mode, only show sections that have the active endpoint
    if (compact) {
      return section === activeEndpoint.path[0];
    }
    return true;
  });

  return (
    <div className="border rounded-lg p-4">
      <h3 className="font-medium text-sm mb-4">API Endpoints</h3>
      <div className="space-y-1">
        {rootSections.map((section) => renderSection(section))}
      </div>
    </div>
  );
}
