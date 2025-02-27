import type { JSX } from "react";
import { ResponsiveContainer } from "recharts";

export const ChartWrapper = ({ children }): JSX.Element => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      {children}
    </ResponsiveContainer>
  );
};
