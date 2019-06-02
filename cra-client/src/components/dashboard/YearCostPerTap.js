import React from "react";
import {
  ResponsiveContainer,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  Tooltip
} from "recharts";

import { FlexRow } from "../Page";

export default props => {
  const {
    dataset,
    budget: { monthlyPassCost }
  } = props;

  dataset.data.forEach(item => {
    let totalMonthlyPassCost = 0;

    if (monthlyPassCost) {
      totalMonthlyPassCost = monthlyPassCost;
    }

    item.costPerTapIfPass = (
      Math.round(
        parseFloat(totalMonthlyPassCost) /
          (item.paymentTaps + item.transferTaps)
      ) / 100
    ).toFixed(2);
    item.costPerTap = (Math.round(item.costPerTap) / 100).toFixed(2);
    item.amount = (Math.round(item.amount) / 100).toFixed(2);
  });

  return (
    <div>
      <FlexRow justify="space-between" align="center">
        <h3
          style={{
            marginTop: "0",
            marginBottom: "0",
            marginLeft: "25px",
            color: "#11BB81"
          }}>
          {"Cost Per Tap"}
        </h3>
        <h3 style={{ marginTop: "0", marginRight: "30px", color: "#3BB4E9" }}>
          {`$${(dataset.costPerTap / 100).toFixed(2)} / Tap`}
        </h3>
      </FlexRow>
      <ResponsiveContainer height={200}>
        <LineChart
          margin={{
            top: 20,
            right: 30,
            left: 0,
            bottom: 0
          }}
          data={dataset.data}>
          <CartesianGrid stroke="#EBEBEB" vertical={false} />
          <Line
            dataKey="costPerTap"
            type="monotone"
            stroke="#3BB4E9"
            strokeWidth={5}
            dot={{
              stroke: "white",
              strokeWidth: 3,
              fill: "#3BB4E9",
              r: 7
            }}
          />
          {dataset.data[0] && dataset.data[0].costPerTapIfPass > 0 && (
            <Line
              dataKey="costPerTapIfPass"
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
          )}
          <YAxis
            type="number"
            tickMargin={20}
            dataKey="costPerTap"
            tickLine={false}
            axisLine={false}
            stroke="#C4C4C4"
          />
          <XAxis
            dataKey="date"
            tickMargin={5}
            tickLine={false}
            axisLine={false}
            stroke="#C4C4C4"
          />
          <Tooltip />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
