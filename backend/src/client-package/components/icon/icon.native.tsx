import * as LucideIcons from "lucide-react-native";
import type { ReactElement } from "react";
import { forwardRef } from "react";
import type { SvgProps } from "react-native-svg";

import { cn } from "@/next-portal/utils/utils";

import type { IconProps } from "./icon.types";

export const Icon = forwardRef<
  SVGSVGElement,
  IconProps & SvgProps
>(
  (
    { name, size = 24, color = "black", className, style, strokeWidth = 2, ...props },
    ref,
  ): ReactElement | null => {
    // Get the icon component from lucide-react-native
    const IconComponent = LucideIcons[name as keyof typeof LucideIcons] as React.FC<
      SvgProps & { size?: number; color?: string; strokeWidth?: number }
    >;

    if (!IconComponent) {
      console.warn(`Icon "${name}" not found`);
      return null;
    }

    return (
      <IconComponent
        ref={ref as any}
        size={size}
        color={color}
        className={cn(className)}
        style={style}
        strokeWidth={strokeWidth}
        {...props}
      />
    );
  },
);

Icon.displayName = "Icon";
