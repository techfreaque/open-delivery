import { ResponsiveContainer } from "recharts"

export const ChartWrapper = ({ children }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      {children}
    </ResponsiveContainer>
  )
}

