import moment from "moment";
import React from "react";
import { Table, Header } from "semantic-ui-react";

import PropTypes from "prop-types";

const propTypes = {};

const defaultProps = {};

function notMutatedSort(array) {
  const newArray = array.slice(0);

  return newArray.sort((a, b) =>
    Date.parse(a.date) > Date.parse(b.date) ? -1 : 1
  );
}

export default function TapList(props) {
  const { data, loading, error } = props;
  let tapRows = [];

  if (loading) return <div>Loading...</div>;

  if (!loading && !error && data.data) {
    const sortedTapRows = notMutatedSort(data.data.transactions);
    tapRows = sortedTapRows.map((item, index) => (
      <Table.Row positive={item.type === "Transfer"} key={item.id}>
        <Table.Cell>{index + 1}</Table.Cell>
        <Table.Cell>
          {moment(item.date)
            .utcOffset(0)
            .format("dddd, MMMM DD, YYYY")}
        </Table.Cell>
        <Table.Cell>
          {moment(item.date)
            .utcOffset(0)
            .format("hh:mm A")}
        </Table.Cell>
        <Table.Cell>{item.location}</Table.Cell>
        <Table.Cell>{item.agency}</Table.Cell>
        <Table.Cell>{item.type}</Table.Cell>
        <Table.Cell>
          {(Math.round(item.amount * 100) / 10000).toFixed(2)}
        </Table.Cell>
      </Table.Row>
    ));
  }
  return (
    <>
      <Header as="h2">
        Tap History
        <Header.Subheader>Some kind of text will go here</Header.Subheader>
      </Header>
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>#</Table.HeaderCell>
            <Table.HeaderCell>Date</Table.HeaderCell>
            <Table.HeaderCell>Time</Table.HeaderCell>
            <Table.HeaderCell>Location</Table.HeaderCell>
            <Table.HeaderCell>Agency</Table.HeaderCell>
            <Table.HeaderCell>Type</Table.HeaderCell>
            <Table.HeaderCell>Amount</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>{tapRows}</Table.Body>
      </Table>
    </>
  );
}

TapList.propTypes = propTypes;
TapList.defaultProps = defaultProps;
