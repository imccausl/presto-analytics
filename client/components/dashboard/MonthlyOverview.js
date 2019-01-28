import React, { Component } from 'react';
import Fetch from 'react-fetch-component';
import { YearInput, MonthInput } from 'semantic-ui-calendar-react';
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

  return chartData;
}

export default class MonthlyOverview extends Component {
  state = {
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
    activeIndex: 0,
    open: false,
    selectedMonth: new Date().getMonth(),
    selectedYear: new Date().getFullYear(),
  };

  close = () => this.setState({ open: false });

  handleCalChange = (event, { name, value }) => {
    this.setState({ [name]: value });
  };

  render() {
    const {
      year, month, open, selectedYear, selectedMonth, activeIndex,
    } = this.state;

    console.log('monthlyOverview:', this.props);

    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();
    return (
      <>
        <Fetch
          url={`${API.root}${API.monthlyTransactions(year, month + 1)}`}
          options={API.send('GET')}
        >
          {(payload) => {
            console.log(payload.error);
            if (!payload.loading && payload.error) {
              return <Message error>{payload.error.message}</Message>;
            }

            return (
              <>
                <Header as="div" attached="top" block>
                  <FlexRow justify="space-between" align="center">
                    <h3 style={{ color: '#5558c8', marginBottom: '0' }}>Monthly Overview</h3>
                    <div>
                      <Tab
                        menu={{ secondary: true }}
                        activeIndex={activeIndex}
                        panes={panes}
                        onTabChange={(e, tab) => {
                          if (tab.activeIndex === 0) {
                            this.setState({
                              month: thisMonth,
                              year: thisYear,
                            });
                          } else if (tab.activeIndex === 1) {
                            this.setState({
                              month: thisMonth === 0 ? 11 : thisMonth - 1,
                              year: thisMonth === 0 ? thisYear - 1 : thisYear,
                            });
                          } else if (tab.activeIndex === 2) {
                            this.setState({ open: true });
                          }

                          this.setState({ activeIndex: tab.activeIndex });
                        }}
                      />
                    </div>
                  </FlexRow>
                </Header>

                <Segment style={{ minHeight: '250px' }} attached loading={payload.loading}>
                  {!payload.loading && (
                    <MonthlyStats
                      month={getMonthNameFromNum(month)}
                      year={year}
                      data={payload.data.data}
                    />
                  )}
                </Segment>
                <Header as="div" attached="bottom" style={{ minHeight: '80px' }}>
                  <FlexRow justify="space-around">
                    {!payload.loading && (
                      <Statistic
                        label="Taps"
                        labelColor="#5558c8"
                        value={payload.data.data.totalTrips}
                      />
                    )}

                    {payload.loading
                      ? ''
                      : getFareTypeCount(payload.data.data.transactions).map(item => (
                        <Statistic label={item.name} labelColor="#5558c8" value={item.value} />
                      ))}
                  </FlexRow>
                </Header>
              </>
            );
          }}
        </Fetch>

        <Modal size="tiny" open={open} onClose={this.close}>
          <Modal.Header>Choose Another Date</Modal.Header>
          <Modal.Content>
            <MonthInput
              inline
              closable
              dateFormat="M"
              name="selectedMonth"
              maxDate={selectedYear == thisYear ? thisMonth + 1 : 12}
              value={selectedMonth || thisMonth + 1}
              onChange={this.handleCalChange}
            />
            <YearInput
              inline
              name="selectedYear"
              closable
              dateFormat="YYYY"
              maxDate={thisYear}
              minDate={2018}
              value={selectedYear || thisYear}
              onChange={this.handleCalChange}
            />
          </Modal.Content>
          <Modal.Actions>
            <Button negative>No</Button>
            <Button
              positive
              icon="checkmark"
              labelPosition="right"
              content="Yes"
              onClick={() => {
                this.setState({
                  month: selectedMonth - 1,
                  year: selectedYear || thisYear,
                  open: false,
                });
              }}
            />
          </Modal.Actions>
        </Modal>
      </>
    );
  }
}
