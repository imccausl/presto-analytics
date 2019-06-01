import moment from 'moment';
import PropTypes from 'prop-types';
import { Header, Container, Grid } from 'semantic-ui-react';

import DataFilter from '../DataFilter';
import SmallStatistic from '../../styled/SmallStatistic';

const propTypes = {};
const defaultProps = {};

export default class User extends React.Component {
  constructor(props) {
    super(props);
    this.state = { activeSelection: 'this month' };
  }

  render() {
    const {
      firstName, cards, balance, budget, lastActivity, amount, since,
    } = this.props;

    return (
      <>
        <Header as="h2" style={{ fontWeight: 200 }}>
          Hey,
          {' '}
          {firstName}
        </Header>

        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <SmallStatistic
            header="Balance"
            body={`$${(Math.round(balance * 100) / 100).toFixed(2)}`}
            footer={`over ${cards.length} card${cards.length !== 1 ? 's' : ''}`}
          />
          <SmallStatistic
            header="Spent"
            body={`$${Math.round(amount / 100)}`}
            footer={`since ${moment(since).format('MMM YYYY')}`}
          />
          <SmallStatistic
            header="Last Charge"
            body={`$${parseFloat(lastActivity.amount / 100).toFixed(2)}`}
            footer={`${moment(lastActivity.date).fromNow()}`}
          />
          <SmallStatistic
            header="Location"
            body={lastActivity.location}
            footer={`${moment(lastActivity.date).fromNow()}`}
          />
          <SmallStatistic header="Updated" body={moment(lastActivity.updated_at).fromNow()} />
        </div>
      </>
    );
  }
}

User.propTypes = propTypes;
User.defaultProps = defaultProps;
