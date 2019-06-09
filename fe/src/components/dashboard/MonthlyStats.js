import React from "react";
import { Segment, Header, Icon } from "semantic-ui-react";
import styled from "styled-components";
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

const TTContainer = styled.div`
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid lightgrey;
  border-radius: 0.25rem;

  .header {
    border-bottom: 1px solid lightgrey;
    margin: 0 5px;
  }
`;

const TTItem = styled.p`
  color: ${props => props.color};
  margin: 0 5px;
`;

const TTLocationList = styled.ul`
  display: block;
  text-decoration: none;
  list-style: none;
`;

const TTLocationItem = styled.li``;

const CustomizedAxisTick = props => {
  const { x, y, stroke, payload } = props;

  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={16}
        textAnchor="end"
        fill="#666"
        transform="rotate(-35)">
        {payload.value}
      </text>
    </g>
  );
};

const CustomTooltip = ({ payload, label, active }) => {
  if (active) {
    const XAxis = payload[0];
    const YAxis = payload[1];

    console.log(XAxis);
    console.log(YAxis);
    return (
      <TTContainer>
        <h2 className="header">{`${XAxis.payload.dayOfWeek}, ${
          XAxis.payload.month
        } ${XAxis.payload.date}, ${XAxis.payload.year}`}</h2>
        <TTItem color={XAxis.color}>{`${XAxis.payload.trips} Tap${
          XAxis.payload.trips === 1 ? "" : "s"
        } ${
          XAxis.payload.trips > 0
            ? `(${XAxis.payload.fares.count} Fare${
                XAxis.payload.fares.count === 1 ? "" : "s"
              } and ${XAxis.payload.transfers.count} Transfer${
                XAxis.payload.transfers.count === 1 ? "" : "s"
              })`
            : ""
        }`}</TTItem>
        <TTItem color={YAxis.color}>{`$${XAxis.payload.amount} Spent`}</TTItem>

        {XAxis.payload.fares.locations.length > 0 && (
          <>
            <h3 className="header">Paid Fares At</h3>
            <TTLocationList>
              {XAxis.payload.fares.locations.map(item => (
                <TTLocationItem>{item}</TTLocationItem>
              ))}
            </TTLocationList>
          </>
        )}

        {XAxis.payload.transfers.locations.length > 0 && (
          <>
            <h3 className="header">Transferred At</h3>
            <TTLocationList>
              {XAxis.payload.transfers.locations.map(item => (
                <TTLocationItem>{item}</TTLocationItem>
              ))}
            </TTLocationList>
          </>
        )}
      </TTContainer>
    );
  }

  return null;
};

export default props => {
  const { data } = props;
  const { transactions } = data;

  const breakdown = totalDailyTransactionBreakdown(transactions, true);
  console.log("breakdown from transactions helper:", breakdown);
  if (!breakdown.dataset) {
    return (
      <Segment placeholder>
        <Header icon>
          <Icon name="calendar times outline" />
          No transactions for this period.
        </Header>
      </Segment>
    );
  }

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
          <CartesianGrid
            stroke="#EBEBEB"
            vertical={false}
            strokeDasharray="5"
          />

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
            padding={{ left: 30, right: 30 }}
            tickMargin={20}
            dataKey="amount"
            tickLine={false}
            axisLine={false}
            stroke="#C4C4C4"
          />
          <XAxis
            dataKey="date"
            //tickMargin={15}
            tickLine={false}
            axisLine={false}
            tick={<CustomizedAxisTick />}
            stroke="#C4C4C4"
          />
          <Tooltip content={<CustomTooltip />} />
          {/* <Legend /> */}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
