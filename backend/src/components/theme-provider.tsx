"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import * as React from "react";

export function ThemeProvider({
  children,
  ...props
}: React.PropsWithChildren): React.JSX.Element {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
