import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import SmallStatistic from '../../styled/SmallStatistic';

const propTypes = {};
const defaultProps = {};

const User = props => {
  const {
    firstName, lastName, cards, balance, lastActivity, amount, since,
  } = props;

  return (
    <div
      style={{
        background: 'white',
        marginLeft: '67px',
        padding: '10px',
        borderBottom: '1px solid lightgrey',
      }}
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
};

User.propTypes = propTypes;
User.defaultProps = defaultProps;

export default User;
