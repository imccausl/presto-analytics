import React from "react";
import { Segment, Message } from "semantic-ui-react";

import MonthlyStats from "./MonthlyStats";

import { getMonthNameFromNum } from "../../lib/date";

const panes = [
  { menuItem: "This Month" },
  { menuItem: "Last Month" },
  { menuItem: { icon: "calendar alternate outline" } }
];

function getFareTypeCount(data) {
  const fareTypeCount = Object.keys(data.count).map(key => {
    const typeName = key;

    return {
      name: typeName[0].toUpperCase() + typeName.substring(1),
      count: data.count[typeName]
    };
  });

  return fareTypeCount;
}

export default function MonthlyOverview(props) {
  const { year, month, data, error, loading } = props;
  console.log("MonthlyOverview:", props);

  return (
    <>
      <Segment style={{ minHeight: "250px" }} loading={loading}>
        {!loading && !error && (
          <MonthlyStats
            month={getMonthNameFromNum(month)}
            year={year}
            data={data.data}
          />
        )}
        {!loading && error && <Message error>{error.message}</Message>}
      </Segment>
    </>
  );
}
