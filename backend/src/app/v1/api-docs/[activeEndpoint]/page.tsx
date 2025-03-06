"use client";

import type { JSX } from "react";

import ApiExplorer from "@/components/api-docs/ApiExplorer";
import { getExampleForEndpoint } from "@/lib/examples/data";

export default async function Page({
  params,
}: {
  params: Promise<{ activeEndpoint: string }>;
}): JSX.Element {
  const { activeEndpoint } = await params;
  const exampleData = getExampleForEndpoint(activeEndpoint.path);
  return <ApiExplorer exampleData={exampleData} />;
}
