import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Header, Menu, Icon } from 'semantic-ui-react';

import requestApi from '../../../lib/requestApi';
import SmallStatistic from '../../styled/SmallStatistic';

const propTypes = {};
const defaultProps = {};

class User extends React.Component {
  render() {
    const {
      firstName, lastName, cards, balance, budget, lastActivity, amount, since,
    } = this.props;

    return (
      <div
        style={{ background: 'white', paddingBottom: '10px', borderBottom: '1px solid lightgrey' }}
      >
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
      </div>
    );
  }
}

User.propTypes = propTypes;
User.defaultProps = defaultProps;

export default withRouter(User);
