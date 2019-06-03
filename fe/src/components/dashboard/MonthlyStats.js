import React from "react";
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

import { totalDailyTransactionBreakdown } from "../../lib/transactions";

export default props => {
  const { data } = props;
  const { transactions } = data;

  const breakdown = totalDailyTransactionBreakdown(transactions, true);

  return (
    <div>
      <ResponsiveContainer height={200}>
        <LineChart
          margin={{
            top: 20,
            right: 30,
            left: 0,
            bottom: 0
          }}
          data={breakdown.dataset}>
          <CartesianGrid stroke="#EBEBEB" vertical={false} />

          <Line
            dataKey="trips"
            type="monotone"
            stroke="#3333cc"
            strokeWidth={2}
            dot={{
              //   stroke: "white",
              //   strokeWidth: 2,
              //   fill: "#3333cc",
              r: 0
            }}
          />
          <Line
            dataKey="amount"
            type="monotone"
            stroke="#3BB4E9"
            strokeWidth={2}
            dot={{
              //   stroke: "white",
              //   strokeWidth: 2,
              //   fill: "#3BB4E9",
              r: 0
            }}
          />
          <YAxis
            allowDecimals={false}
            type="number"
            domain={breakdown.domain}
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
    </div>
  );
};
