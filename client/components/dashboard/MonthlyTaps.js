import {
  ResponsiveContainer,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  Legend,
  Tooltip
} from "recharts";

export default props => (
  <ResponsiveContainer height={200}>
    <LineChart
      margin={{
        top: 20,
        right: 30,
        left: 0,
        bottom: 0
      }}
      data={breakdown}
    >
      <CartesianGrid stroke="#EBEBEB" vertical={false} />

      <Line
        dataKey="trips"
        type="monotone"
        stroke="#3333cc"
        strokeWidth={5}
        dot={{
          stroke: "white",
          strokeWidth: 3,
          fill: "#3333cc",
          r: 7
        }}
      />
      <YAxis
        allowDecimals={false}
        type="number"
        domain={domain}
        tickMargin={20}
        dataKey="amount"
        tickLine={false}
        axisLine={false}
        stroke="#C4C4C4"
      />
      <XAxis
        dataKey="date"
        tickMargin={15}
        tickLine={false}
        axisLine={false}
        stroke="#C4C4C4"
      />
      <Tooltip />
      <Legend />
    </LineChart>
  </ResponsiveContainer>
);
