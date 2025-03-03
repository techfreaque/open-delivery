import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { APP_NAME } from "@/constants";

import { env } from "./env";

/**
 * Utility for conditionally joining class names
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function debugLogger(message: string, ...other: unknown[]): void {
  if (env.NODE_ENV === "development") {
    // eslint-disable-next-line no-console
    console.log(`[${APP_NAME}][DEBUG] ${message}`, ...other);
  }
}
