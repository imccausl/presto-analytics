import moment from "moment";
import React from "react";
import PropTypes from "prop-types";
import { Card } from "semantic-ui-react";

import Statistic from "../../styled/Statistic";

const propTypes = {};

const defaultProps = {};

export default function FilteredStats(props) {
  const { data, loading, error } = props;

  let totalAmount = 0;
  let prevTotalAmount = 0;
  let totalTaps = 0;
  let prevTotalTaps = 0;
  let totalFares = 0;
  let prevTotalFares = 0;
  let totalTransfers = 0;
  let prevTotalTransfers = 0;
  let prevLastDate = Date.now();
  let prevFirstDate = Date.now();

  if (!loading && !error) {
    totalAmount = data.data.totalAmount;
    prevTotalAmount = data.data.prevInterval.totalAmount;

    totalTaps = data.data.count.transfers + data.data.count.fares;
    prevTotalTaps =
      data.data.prevInterval.count.transfers +
      data.data.prevInterval.count.fares;

    totalFares = data.data.count.fares;
    prevTotalFares = data.data.prevInterval.count.fares;

    totalTransfers = data.data.count.transfers;
    prevTotalTransfers = data.data.prevInterval.count.transfers;

    prevLastDate = data.data.prevInterval.transactions.length
      ? moment(
          data.data.prevInterval.transactions[
            data.data.prevInterval.transactions.length - 1
          ].date
        )
          .utcOffset(0)
          .format("DD MMM")
      : null;
    prevFirstDate = data.data.prevInterval.transactions.length
      ? moment(data.data.prevInterval.transactions[0].date)
          .utcOffset(0)
          .format("MM/DD/YYYY")
      : null;

    console.log(data.data.prevInterval.transactions.length - 1);
  }

  return (
    <Card.Group centered>
      {!loading && !error && (
        <>
          <Statistic
            label="Spent"
            value={`$${(totalAmount / 100).toFixed(2)}`}
            extra={`$${Math.abs((totalAmount - prevTotalAmount) / 100).toFixed(
              2
            )} ${prevLastDate ? "from period ending " + prevLastDate : ""}`}
            extraIcon={
              totalAmount - prevTotalAmount > 0
                ? "ti-arrow-up"
                : "ti-arrow-down"
            }
            iconName="ti-credit-card"
            isCustomIcon
          />

          <Statistic
            label="Taps"
            value={totalTaps}
            extra={`${Math.abs(totalTaps - prevTotalTaps)} ${
              prevLastDate ? "from period ending " + prevLastDate : ""
            }`}
            extraIcon={
              totalTaps - prevTotalTaps > 0 ? "ti-arrow-up" : "ti-arrow-down"
            }
            iconName="ti-hand-drag"
            isCustomIcon
          />

          <Statistic
            label="Fares"
            value={totalFares}
            extra={`${Math.abs(totalFares - prevTotalFares)} ${
              prevLastDate ? "from period ending " + prevLastDate : ""
            }`}
            extraIcon={
              totalFares - prevTotalFares > 0 ? "ti-arrow-up" : "ti-arrow-down"
            }
            iconName="ti-ticket"
            isCustomIcon
          />

          <Statistic
            label="Transfers"
            value={totalTransfers}
            extra={`${Math.abs(totalTransfers - prevTotalTransfers)} ${
              prevLastDate ? "from period ending " + prevLastDate : ""
            }`}
            extraIcon={
              totalTransfers - prevTotalTransfers > 0
                ? "ti-arrow-up"
                : "ti-arrow-down"
            }
            iconName="ti-vector"
            isCustomIcon
          />
        </>
      )}
    </Card.Group>
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
