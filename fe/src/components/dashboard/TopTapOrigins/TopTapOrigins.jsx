import moment from "moment";
import React from "react";
import PropTypes from "prop-types";
import { Segment, List, Progress, Header } from "semantic-ui-react";

const propTypes = {};

const defaultProps = {};

function orderLocationByMostTaps(dataset) {
  const result = {};

  dataset.forEach(item => {
    if (item.location === "0") return;

    if (result[item.location]) {
      const prevLastVisited = Date.parse(result[item.location].lastVisited);
      const currLastVisited = item.date;

      result[item.location].count += 1;

      if (Date.parse(item.date) > prevLastVisited) {
        result[item.location].lastVisited = currLastVisited;
      }
    } else {
      result[item.location] = { count: 1, lastVisited: item.date };
    }
  });

  const resultArray = Object.keys(result).map(key => {
    return {
      location: key,
      ...result[key]
    };
  });

  resultArray.sort((a, b) => (a.count > b.count ? -1 : 1));

  return resultArray.slice(0, 10);
}

export default function TopTapOrigins(props) {
  const { data, error, loading } = props;
  let dataset = [];

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!loading && !error) {
    dataset = orderLocationByMostTaps(data.data.transactions);
    console.log(dataset);
  }

  const TopStops = dataset.map(item => (
    <List.Item key={Date.parse(item.lastVisited)}>
      <List.Content>
        <List.Header>{item.location}</List.Header>
        Last visited {moment(item.lastVisited).fromNow()}
      </List.Content>
      <List.Content>
        <Progress percent={(item.count / data.data.transactions.length) * 100}>
          Visited {item.count} time{item.count === 1 ? "" : "s"}
        </Progress>
      </List.Content>
    </List.Item>
  ));

  return (
    <>
      <Header as="h2">
        Top 10 Tap Origins
        <Header.Subheader>Some kind of text will go here</Header.Subheader>
      </Header>
      <Segment>
        <List divided relaxed>
          {TopStops}
        </List>
      </Segment>
    </>
  );
}

TopTapOrigins.propTypes = propTypes;
TopTapOrigins.defaultProps = defaultProps;
