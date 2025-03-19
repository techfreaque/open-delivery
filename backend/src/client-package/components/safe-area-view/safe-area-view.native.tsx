import type { ElementRef, ReactElement } from "react";
import { forwardRef } from "react";
import type { ViewProps } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

import { cn } from "@/next-portal/utils/utils";

import type { SafeAreaViewProps } from "./safe-area-view.types";

export interface NativeSafeAreaViewProps
  extends ViewProps,
    SafeAreaViewProps {}

export const SafeAreaView = forwardRef<
  ElementRef<typeof RNSafeAreaView>,
  NativeSafeAreaViewProps
>(({ children, className, style, ...props }, ref): ReactElement => {
  return (
    <RNSafeAreaView
      ref={ref}
      className={cn(className)}
      style={style}
      {...props}
    >
      {children}
    </RNSafeAreaView>
  );
});

SafeAreaView.displayName = "SafeAreaView";
