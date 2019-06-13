import moment from "moment";
import React from "react";
import PropTypes from "prop-types";
import { Card, Statistic } from "semantic-ui-react";

//import Statistic from "../../styled/Statistic";

const propTypes = {};

const defaultProps = {};

export default function FilteredStats(props) {
  const { data, loading, error } = props;

  console.log("filteredStats:", data, loading, error);
  return (
    <Statistic.Group widths="four" color="orange" size="small">
      {!loading && !error && (
        <>
          <Statistic>
            <Statistic.Value>
              {`$${(data.data.totalAmount / 100).toFixed(2)}`}
            </Statistic.Value>
            <Statistic.Label>Spent</Statistic.Label>
          </Statistic>

          <Statistic>
            <Statistic.Value>
              {data.data.count.transfers + data.data.count.fares}
            </Statistic.Value>
            <Statistic.Label>Taps</Statistic.Label>
          </Statistic>

          <Statistic>
            <Statistic.Value>{data.data.count.fares}</Statistic.Value>
            <Statistic.Label>Fares</Statistic.Label>
          </Statistic>

          <Statistic>
            <Statistic.Value>{data.data.count.transfers}</Statistic.Value>
            <Statistic.Label>Transfers</Statistic.Label>
          </Statistic>
        </>
      )}
    </Statistic.Group>
  );
}

FilteredStats.propTypes = propTypes;
FilteredStats.defaultProps = defaultProps;

/* <Card.Group
centered
style={{ display: "flex", flexDirection: "row", alignItems: "stretch" }}>
{!loading && !error && (
  <>
    <Statistic
      label="Spent"
      value={`$${(data.data.totalAmount / 100).toFixed(2)}`}
      extra={
        data.data.transactions.length === 0
          ? "Never"
          : moment(data.data.transactions[1].date).fromNow()
      }
      isCustomIcon
      iconName="ti-credit-card"
      iconColor="orange"
    />
    <Statistic
      label="Fares"
      iconName="ti-ticket"
      iconColor="#3BB4E9"
      value={data.data.count.fares}
      isCustomIcon
    />
    <Statistic
      label="Transfers"
      iconName="ti-vector"
      iconColor="#5558c8"
      value={data.data.count.transfers}
      isCustomIcon
    />
  </>
)}
</Card.Group> */
