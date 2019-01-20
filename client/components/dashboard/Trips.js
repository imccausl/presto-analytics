import { Icon, Table } from 'semantic-ui-react';
import moment from 'moment';

export default ({ trips }) => {
  const Event = ({ trip }) => {
    let icon = 'bus';

    if (trip.location.includes('STATION')) {
      icon = 'subway';
    }
    console.log(trip);
    return (
      <Table.Row positive={trip.type === 'Transfer'}>
        <Table.Cell>
          {moment(trip.date)
            .utcOffset(0)
            .format('MM/DD/YYYY hh:mm:ss A')}
        </Table.Cell>
        <Table.Cell>{trip.agency}</Table.Cell>
        <Table.Cell>
          <Icon name={icon} />
          {' '}
          {trip.location}
        </Table.Cell>
        <Table.Cell>{trip.type}</Table.Cell>
        <Table.Cell>{`$${trip.amount}`}</Table.Cell>
        <Table.Cell>{`$${trip.balance}`}</Table.Cell>
      </Table.Row>
    );
  };

  return (
    <div style={{ margin: '0 10px', marginBottom: '10px' }}>
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Date</Table.HeaderCell>
            <Table.HeaderCell>Agency</Table.HeaderCell>
            <Table.HeaderCell>Location</Table.HeaderCell>
            <Table.HeaderCell>Type</Table.HeaderCell>
            <Table.HeaderCell>Amount</Table.HeaderCell>
            <Table.HeaderCell>Balance</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {trips.map(trip => (
            <Event trip={trip} />
          ))}
        </Table.Body>
      </Table>
    </div>
  );
};
