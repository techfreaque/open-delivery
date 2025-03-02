import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";

import { DatabaseProvider } from "../lib/context/DatabaseContext";
import { UserTypeProvider } from "../lib/context/UserTypeContext";

declare global {
  interface Window {
    frameworkReady?: () => void;
  }
}

export default function RootLayout() {
  useEffect(() => {
    window.frameworkReady?.();
  }, []);

  return (
    <DatabaseProvider>
      <UserTypeProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </UserTypeProvider>
    </DatabaseProvider>
  );
}
