import moment from "moment";
import React from "react";
import PropTypes from "prop-types";
import { Card } from "semantic-ui-react";

import Statistic from "../../styled/Statistic";

const propTypes = {};

const defaultProps = {};

export default function FilteredStats(props) {
  const { data, loading, error } = props;

  console.log("filteredStats:", data, loading, error);
  return (
    <Card.Group
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
    </Card.Group>
  );
}

FilteredStats.propTypes = propTypes;
FilteredStats.defaultProps = defaultProps;
