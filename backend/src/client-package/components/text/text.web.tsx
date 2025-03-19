import type { HTMLAttributes, ReactElement } from "react";
import { forwardRef } from "react";

import { cn } from "@/next-portal/utils/utils";

import { textVariants } from "./text.core";
import type { BaseTextProps } from "./text.types";

export interface WebTextProps
  extends HTMLAttributes<HTMLParagraphElement>,
    BaseTextProps {
  variant?: "default" | "lead" | "large" | "small" | "muted";
}

export const Text = forwardRef<HTMLParagraphElement, WebTextProps>(
  ({ children, className, style, variant, ...props }, ref): ReactElement => {
    return (
      <p
        ref={ref}
        className={cn(textVariants({ variant, className }))}
        style={style}
        {...props}
      >
        {children}
      </p>
    );
  },
);

Text.displayName = "Text";
