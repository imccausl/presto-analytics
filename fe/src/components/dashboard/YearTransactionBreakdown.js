import React from "react";
import moment from "moment";
import {
  ResponsiveContainer,
  CartesianGrid,
  Bar,
  BarChart,
  XAxis,
  YAxis,
  ReferenceLine,
  Tooltip
} from "recharts";

import { FlexRow } from "../Page";

export default props => {
  const { dataset } = props;
  const numOfMonths = dataset.data.length;

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
          {"Tap Overview"}
        </h3>
        <h3 style={{ marginTop: "0", marginRight: "30px", color: "#3BB4E9" }}>
          {`${dataset.totalTaps} Taps Total`}
        </h3>
      </FlexRow>
      <ResponsiveContainer height={200}>
        <BarChart
          margin={{
            top: 20,
            right: 30,
            left: 0,
            bottom: 0
          }}
          data={dataset.data}>
          <CartesianGrid stroke="#EBEBEB" vertical={false} />
          <Tooltip />
          <Bar stackId="a" dataKey="paymentTaps" fill="#3333cc" />
          <Bar stackId="a" dataKey="transferTaps" fill="#3BB4E9" />
          <ReferenceLine
            y={dataset.totalTaps / numOfMonths}
            label="Average Monthly Taps"
            stroke="red"
          />
          <YAxis
            allowDecimals={false}
            type="number"
            dataKey="paymentTaps"
            tickLine={false}
            axisLine={false}
          />
          <XAxis dataKey="date" tickLine={false} axisLine={false} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
