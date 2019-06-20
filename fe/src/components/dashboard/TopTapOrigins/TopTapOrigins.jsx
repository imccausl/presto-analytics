import moment from "moment";
import React from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Tooltip,
  Cell,
  Legend
} from "recharts";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Header, Divider } from "semantic-ui-react";

const propTypes = {};
const defaultProps = {};
const COLORS = [
  "#3F69AA",
  "#006E6D",
  "#E8B5CE",
  "#FFD662",
  "#8D9440",
  "#C62168",
  "#6B5B95",
  "#FE840E",
  "#BFD641",
  "#6F9FD8"
];

const ListRank = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  background: orange;
  color: white;
  min-width: 50px;
  min-height: 50px;
  max-width: 50px;
  max-height: 50px;

  border-radius: 100%;

  font-weight: 800;
  font-size: 1.3rem;
`;

const ListItem = styled.li`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 10px;

  &:nth-child(even) {
    background: #f3f1f1;
  }
`;

const ListHeader = styled.div`
  display: block;
  font-weight: 800;
  font-size: 1.1rem;
  color: black;
`;

const ListContent = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-flow: row wrap;
  align-items: center;
  margin-left: 15px;
  font-size: 0.9rem;
  color: #9a9898;
  width: 100%;
`;

const FlexGrowBox = styled.div`
  color: black;
  flex-grow: 1;
  text-align: right;
  font-size: 2.5rem;
`;

const List = styled.ul`
  padding: 0;
  border-radius: 0.25rem;
  border: 1px solid lightgrey;
`;

function orderLocationByMostTaps(dataset) {
  const result = {};

  dataset.forEach(item => {
    if (item.location === "0") return;

    if (result[item.location]) {
      const prevLastVisited = Date.parse(result[item.location].lastVisited);
      const currLastVisited = item.date;

      result[item.location].count += 1;
      result[item.location].amount += item.amount;
      result[item.location].transfers += item.type === "Transfer" ? 1 : 0;
      result[item.location].fares +=
        item.type === "Fare Payment" || item.type === "Transit Pass Payment"
          ? 1
          : 0;

      if (Date.parse(item.date) > prevLastVisited) {
        result[item.location].lastVisited = currLastVisited;
      }
    } else {
      result[item.location] = {
        count: 1,
        amount: item.amount,
        lastVisited: item.date,
        transfers: item.type === "Transfer" ? 1 : 0,
        fares:
          item.type === "Fare Payment" || item.type === "Transit Pass Payment"
            ? 1
            : 0
      };
    }
  });

  const resultArray = Object.keys(result)
    .map(key => {
      return {
        location: key,
        percent: Math.round((result[key].count / dataset.length) * 100),
        ...result[key]
      };
    })
    .filter(item => item.count > 1);

  const truncatedResults = resultArray
    .sort((a, b) => (a.count > b.count ? -1 : 1))
    .slice(0, 10);

  return truncatedResults;
}

export default class TopTapOrigins extends React.Component {
  render() {
    const { data, error, loading } = this.props;
    let dataset = [];
    let range = "";

    if (loading) {
      return <div>Loading...</div>;
    }

    if (!loading && !error) {
      dataset = orderLocationByMostTaps(data.data.transactions);
      range =
        data.data.transactions.length === 0
          ? "No Transactions For This Period"
          : `${moment(data.data.transactions[0].date).format(
              "MMMM DD YYYY"
            )} - ${moment(
              data.data.transactions[data.data.transactions.length - 1].date
            ).format("MMMM DD YYYY")}`;
      console.log(dataset);
    }

    const TopStops = dataset.map(item => (
      <ListItem key={Date.parse(item.lastVisited)}>
        <ListRank>
          {Math.round((item.count / data.data.transactions.length) * 100)}%
        </ListRank>
        <ListContent>
          <div>
            <ListHeader>{item.location}</ListHeader>
            {item.count} Tap{item.count === 1 ? "" : "s"}
            {item.fares} Fare{item.fares === 1 ? "" : "s"}
            {item.transfers} Transfer{item.fares === 1 ? "" : "s"}
          </div>
          <FlexGrowBox>
            {"$"}
            {(Math.round(item.amount * 100) / 10000).toFixed(2)}
          </FlexGrowBox>
        </ListContent>
      </ListItem>
    ));

    return (
      <>
        <Divider horizontal>
          <Header as="h3">
            Most Active Locations
            <Header.Subheader>{range}</Header.Subheader>
          </Header>
        </Divider>
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie data={dataset} fill="#8884d8" dataKey="count">
              {dataset.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
            <Legend
              iconType="circle"
              verticalAlign="bottom"
              payload={dataset.map((item, index) => ({
                value: item.location,
                type: "circle",
                id: item.id,
                color: COLORS[index]
              }))}
            />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </>
    );
  }
}

TopTapOrigins.propTypes = propTypes;
TopTapOrigins.defaultProps = defaultProps;

/* <>

      <List>{TopStops}</List>
    </> */
