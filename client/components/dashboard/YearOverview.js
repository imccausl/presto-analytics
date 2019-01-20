import React, { Component } from 'react';
import Fetch from 'react-fetch-component';
import { Tab, Segment, Header } from 'semantic-ui-react';

import YearStats from './YearStats';
import { FlexRow } from '../Page';

import API from '../../util/api';
import { getMonthNameFromNum } from '../../util/date';

const panes = [
  { menuItem: 'This Month' },
  { menuItem: 'Last Month' },
  { menuItem: { icon: 'calendar alternate outline' } },
];

function getFareTypeCount(data) {
  const sortedData = {};

  data.forEach((item) => {
    if (!sortedData[item.type]) {
      sortedData[item.type] = 1;
    } else {
      sortedData[item.type] += 1;
    }
  });

  const chartData = Object.keys(sortedData).map(key => ({
    name: sortedData[key] === 1 ? key : `${key}s`,
    value: sortedData[key],
  }));

  console.log(chartData);
  return chartData;
}

export default class MonthlyOverview extends Component {
  state = {
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
    activeIndex: 0,
    selectedMonth: new Date().getMonth(),
    selectedYear: new Date().getFullYear(),
  };

  render() {
    const {
      year, month, selectedYear, selectedMonth, activeIndex,
    } = this.state;

    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();

    return (
      <Fetch url={`${API.root}${API.yearToDateData.endpoint}`} options={API.send('GET')}>
        {payload => (
          <div style={{ width: '100%' }}>
            <Header as="div" attached="top" block>
              <FlexRow justify="space-between" align="center">
                <h3 style={{ color: '#5558c8', marginBottom: '0' }}>Yearly Overview</h3>
              </FlexRow>
            </Header>

            <Segment style={{ minHeight: '250px' }} attached loading={payload.loading}>
              {!payload.loading && <YearStats data={payload.data.data} />}
            </Segment>
          </div>
        )}
      </Fetch>
    );
  }
}
