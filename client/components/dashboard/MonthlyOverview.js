import React, { Component } from 'react';
import Fetch from 'react-fetch-component';
import {
  Tab, Modal, Button, Segment, Header, Message,
} from 'semantic-ui-react';

import Statistic from '../styled/Statistic';
import MonthlyStats from './MonthlyStats';
import { FlexRow } from '../Page';

import API from '../../lib/api';
import { getMonthNameFromNum } from '../../lib/date';

const panes = [
  { menuItem: 'This Month' },
  { menuItem: 'Last Month' },
  { menuItem: { icon: 'calendar alternate outline' } },
];

function getFareTypeCount(data) {
  const fareTypeCount = Object.keys(data.count).map(key => {
    const typeName = key;

    return {
      name: typeName[0].toUpperCase() + typeName.substring(1),
      count: data.count[typeName],
    };
  });

  return fareTypeCount;
}

export default class MonthlyOverview extends Component {
  render() {
    const { year, month } = this.props;

    console.log('monthlyOverview:', this.props);

    return (
      <>
        <Fetch
          url={`${API.root}${API.monthlyTransactions(year, month + 1)}`}
          options={API.send('GET')}
        >
          {payload => {
            console.log(payload);

            return (
              <>
                <Segment style={{ minHeight: '250px' }} loading={payload.loading}>
                  {!payload.loading && !payload.error && (
                    <MonthlyStats
                      month={getMonthNameFromNum(month)}
                      year={year}
                      data={payload.data.data}
                    />
                  )}
                  {!payload.loading && payload.error && (
                    <Message error>{payload.error.message}</Message>
                  )}
                </Segment>
              </>
            );
          }}
        </Fetch>
      </>
    );
  }
}
