import moment from "moment";
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
  position: relative;
  background: rgba(40, 42, 48, 0.7);
  color: lightgrey;
  border: 1px solid lightgrey;
  border-radius: 0.25rem;
  min-width: 400px;
  padding: 30px 50px 40px 50px;
  box-shadow: 0px 1px 2px 0 rgba(34, 36, 38, 0.15);

  header {
    background: rgba(40, 42, 48, 0.8);
    bottom: 0;
    left: 0;
    margin: 0;
    padding: 0;
    position: absolute;
    width: 100%;

    h2 {
      font-size: 1.1rem;
      text-align: center;
      font-weight: bold;
      padding: 10px 5px;
    }
  }

  footer {
    margin: 20px 0;
  }

  h3 {
    font-size: 1rem;
    font-weight: bold;
    padding: 0;
    margin: 0;
    margin-bottom: 5px;
    margin-top: 15px;
  }
`;

const TTItem = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 5px;

  p {
    font-weight: bold;
  }

  .count {
    text-align: right;
    padding: 0;
    margin: 0;

    .breakdown {
      padding: 0;
      margin: 0;
      margin-top: -5px;
      margin-bottom: -8px;
      font-size: 0.7rem;
    }
  }

  &.trip-count {
    align-items: flex-start;
  }
`;

const TTLocationList = styled.ul`
  display: block;
  text-decoration: none;
  list-style: none;
  list-style-type: none;
  list-style-position: outside;
  margin: 0;
  padding: 0;
`;

const LegendDot = styled.div`
  background: ${props => props.color};
  max-height: 10px;
  max-width: 10px;
  min-height: 10px;
  min-width: 10px;
  margin-right: 15px;
  border-radius: 100%;
`;

const TTLocationItem = styled.li`
  font-size: 0.8rem;
  list-style: none;
  list-style-type: none;
  margin: 0;
  padding: 0;
`;

const CustomizedAxisTick = props => {
  const { x, y, stroke, payload } = props;
  console.log("CUSTOMIZEDAXISTICK:", payload);
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
        <header>
          <h2>{`${XAxis.payload.dayOfWeek}, ${XAxis.payload.month} ${
            XAxis.payload.date
          }, ${XAxis.payload.year}`}</h2>
        </header>
        <TTItem className="trip-count">
          <TTItem>
            <LegendDot color={XAxis.color} />
            <p>Taps</p>
          </TTItem>
          <div className="count">
            <div>{XAxis.payload.trips}</div>
            <div className="breakdown">
              {`${
                XAxis.payload.trips > 0
                  ? `${XAxis.payload.fares.count} Fare${
                      XAxis.payload.fares.count === 1 ? "" : "s"
                    } | ${XAxis.payload.transfers.count} Transfer${
                      XAxis.payload.transfers.count === 1 ? "" : "s"
                    }`
                  : ""
              }`}
            </div>
          </div>
        </TTItem>
        <TTItem>
          <TTItem>
            <LegendDot color={YAxis.color} />
            <p>Spent</p>
          </TTItem>
          <div>${XAxis.payload.amount}</div>
        </TTItem>

        <footer>
          {XAxis.payload.fares.locations.length > 0 && (
            <>
              <h3 className="header">Fares</h3>
              <TTLocationList>
                {XAxis.payload.fares.locations.map(item => (
                  <TTItem>
                    <TTLocationItem>{item.location}</TTLocationItem>
                    <TTLocationItem>
                      {moment(item.time)
                        .utcOffset(0)
                        .format("hh:mm A")}
                    </TTLocationItem>
                  </TTItem>
                ))}
              </TTLocationList>
            </>
          )}

          {XAxis.payload.transfers.locations.length > 0 && (
            <>
              <h3 className="header">Transfers</h3>
              <TTLocationList>
                {XAxis.payload.transfers.locations.map(item => (
                  <TTItem>
                    <TTLocationItem>{item.location}</TTLocationItem>
                    <TTLocationItem>
                      {moment(item.time)
                        .utcOffset(0)
                        .format("hh:mm A")}
                    </TTLocationItem>
                  </TTItem>
                ))}
              </TTLocationList>
            </>
          )}
        </footer>
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
      <ResponsiveContainer height={300} style={{ background: "#444" }}>
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
            dataKey="label"
            //tickMargin={15}
            tickLine={false}
            axisLine={false}
            tickSize={0}
            minTickGap={0}
            height={60}
            interval="preserveStartEnd"
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
