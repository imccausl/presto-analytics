import React, { Component } from 'react';
import Fetch from 'react-fetch-component';
import {
  Tab, Segment, Header, Message,
} from 'semantic-ui-react';

import YearStats from './YearStats';
import YearCostPerTap from './YearCostPerTap';
import YearTransactionBreakdown from './YearTransactionBreakdown';

import { FlexRow } from '../Page';

import API from '../../lib/api';

function getMonthNumFromName(name) {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  return months.indexOf(name) + 1;
}

function getDataset(obj) {
  const dataset = {
    data: [],
    totalAmount: 0,
    totalTaps: 0,
    costPerTap: 0,
  };
  const years = Object.keys(obj);

  years.forEach((year) => {
    const months = Object.keys(obj[year]);
    months.forEach((month) => {
      const { amount, transactions, transitPassAmount } = obj[year][month];
      const monthYearString = `${getMonthNumFromName(month)}/${year}`;
      const payments = transactions.filter(item => item.type.includes('Payment'));
      const transfers = transactions.filter(item => item.type.includes('Transfer'));

      dataset.totalAmount += amount + transitPassAmount;
      dataset.totalTaps += transactions.length;

      dataset.data.push({
        date: monthYearString,
        amount: amount + transitPassAmount,
        costPerTap: Math.round(100 * ((amount + transitPassAmount) / transactions.length)) / 100,
        paymentTaps: payments.length,
        transferTaps: transfers.length,
        taps: transactions.length,
      });
    });
  });

  dataset.costPerTap = Math.round(100 * (dataset.totalAmount / dataset.totalTaps)) / 100;

  return dataset;
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
    console.log(this.props);
    const {
      year, month, selectedYear, selectedMonth, activeIndex,
    } = this.state;
    const { budget } = this.props;

    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();

    return (
      <Fetch url={`${API.root}${API.yearToDateData.endpoint}`} options={API.send('GET')}>
        {(payload) => {
          let dataset = {};

          if (!payload.loading && payload.error) {
            return <Message error>{payload.error.message}</Message>;
          }

          if (!payload.loading) {
            dataset = getDataset(payload.data.data);
          }

          return (
            <>
              <FlexRow padding="0 0 10px 0">
                <div style={{ width: '50%', marginRight: '10px' }}>
                  <Segment style={{ minHeight: '250px' }} loading={payload.loading}>
                    {!payload.loading && <YearStats dataset={dataset} budget={budget} />}
                  </Segment>
                </div>
                <div style={{ width: '50%' }}>
                  <Segment style={{ minHeight: '250px' }} loading={payload.loading}>
                    {!payload.loading && <YearCostPerTap dataset={dataset} budget={budget} />}
                  </Segment>
                </div>
              </FlexRow>
              <div style={{ width: '100%' }}>
                <Segment style={{ minHeight: '250px' }} loading={payload.loading}>
                  {!payload.loading && <YearTransactionBreakdown dataset={dataset} />}
                </Segment>
              </div>
            </>
          );
        }}
      </Fetch>
    );
  }
}
