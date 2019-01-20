import moment from 'moment';
import React, { Component } from 'react';
import Fetch from 'react-fetch-component';
import { YearInput, MonthInput } from 'semantic-ui-calendar-react';
import {
  Dimmer, Loader, Tab, Modal, Button, Segment
} from 'semantic-ui-react';
import styled from 'styled-components';

import AuthUser from './AuthUser';
import Statistic from './styled/Statistic';
import MonthlyStats from './dashboard/MonthlyStats';
import TapLocations from './dashboard/TapLocations';
import { FlexRow } from './Page'

import API from '../util/api';

import Transactions from './dashboard/Transactions';
import Trips from './dashboard/Trips';
import MonthlyListing from './dashboard/MonthlyListing';
import { UserContext } from './Page';

import { getMonthNameFromNum } from '../util/date';

const Main = styled.div`
  .main {
    .main-header {
      top: 0;
      display: flex;
      justify-content: flex-start;
      padding: 20px;
      color: white;
    }

    

    .main-overview-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      align-items: left;
      flex-direction: row;
      margin: 20px;
    }

    .main-overview {
      display: flex;
      justify-content: center;
      align-items: left;
      flex-direction: column;
      background: white;
      padding: 20px;
      margin: 0 20px;
      border-radius: 0.5em;
      box-shadow: 0 1px 6px rgba(32, 33, 36, 0.28);
    }

   
  }
`;

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

export default class Dashboard extends Component {
  static contextType = UserContext;

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
    console.log(name, value);
    this.setState({ [name]: value });
  };


  render() {
    const {
      year, month, open, selectedYear, selectedMonth, activeIndex,
    } = this.state;

    const {
      data: { data: { user } },
    } = this.context;
    
    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();

    return (
              <>
                <Main>
                  <main className="main">

                    <Fetch
                      url={`${API.root}${API.monthlyTransactions(year, month + 1)}`}
                      options={API.send('GET')}
                    >
                      {(payload) => {
                        if (payload.loading) {
                          return <Loader active />;
                        }
                        console.log(payload.data.data)

                        return (
                          <>
                            <div className="main-overview-header">
                              <h2 style={{ color: '#9092A5', marginBottom: '0'}}>OVERVIEW</h2>
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
                            </div>
                            <div className="main-overview">
                              <MonthlyStats month={getMonthNameFromNum(month)} year={year} data={payload.data.data} />
                            </div>
                                


                            
                                  <div style={{ width: '75%', margin: '0 auto', padding: '10px 0'}}>
                                  <FlexRow justify="space-between">
                                  
                                    
                                    <Statistic label="Taps" labelColor="#5558c8" value={payload.data.data.totalTrips} />
                                    {getFareTypeCount(payload.data.data.transactions).map(item => (
                                        <Statistic label={item.name} labelColor="#5558c8" value={item.value} />
                                    ))}
                                  </FlexRow>
                                  </div>

                            <Trips trips={payload.data.data.transactions} />
                          </>
                        );
                      }}
                    </Fetch>
                  </main>
                </Main>

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
                        console.log(selectedYear, selectedMonth);
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
