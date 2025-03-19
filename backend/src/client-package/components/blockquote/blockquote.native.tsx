import type { ElementRef, ReactElement } from "react";
import { forwardRef } from "react";
import type { ViewProps } from "react-native";
import { View } from "react-native";

import { cn } from "@/next-portal/utils/utils";
import { blockquoteVariants } from "./blockquote.core";
import type { BaseBlockquoteProps } from "./blockquote.types";

export interface NativeBlockquoteProps extends ViewProps, BaseBlockquoteProps {
  variant?: "default" | "primary" | "secondary" | "accent";
}

export const Blockquote = forwardRef<
  ElementRef<typeof View>,
  NativeBlockquoteProps
>(({ children, className, style, variant, ...props }, ref): ReactElement => {
  return (
    <View
      ref={ref}
      className={cn(blockquoteVariants({ variant, className }))}
      style={style}
      {...props}
    >
      {children}
    </View>
  );
});

Blockquote.displayName = "Blockquote";
