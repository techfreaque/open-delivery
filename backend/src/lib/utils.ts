import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { APP_NAME } from "@/constants";

import { envClient } from "./env-client";

/**
 * Utility for conditionally joining class names
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function debugLogger(message: string, ...other: unknown[]): void {
  if (envClient.NEXT_PUBLIC_NODE_ENV === "development") {
    // eslint-disable-next-line no-console
    console.log(`[${APP_NAME}][DEBUG] ${message}`, ...other);
  }
}
