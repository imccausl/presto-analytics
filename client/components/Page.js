import moment from 'moment';
import React, { Component } from 'react';
import Router from 'next/router';
import {
  Dropdown,
  Icon,
  Dimmer,
  Loader,
  Button,
  Card,
  Menu,
  Message,
  Grid,
  Container,
  Segment,
  Header,
} from 'semantic-ui-react';
import styled, { ThemeProvider, injectGlobal } from 'styled-components';
import PropTypes from 'prop-types';

import AccountSettings from './AccountSettings';
import Index from './Index';
import AuthUser from './AuthUser';
import Login from './Login';
import Meta from './Meta';
import SideBar from './SideBar';
import Statistic from './styled/Statistic';
import UpdatePresto from './dashboard/UpdatePresto';

import requestApi from '../lib/requestApi';

const UserContext = React.createContext();

const Content = styled.div`
  position: relative;
  width: 100%;
  color: white;
  z-index: 1;
`;

const Main = styled.main`
  border-radius: 0.7em;
  margin-left: 30px;
  min-height: 400px;
  margin-right: 15px;
  /* border: 1px solid lightgrey; */
  /* background: white; */
  margin-top: 10px;
  box-shadow: 0 1px 6px rgba(32, 33, 36, 0.28);
  padding: 10px;
`;

const FlexRow = styled.div`
  display: flex;
  position: relative;
  flex-wrap: nowrap;
  width: ${props => props.width || '100%'};
  flex-direction: row;
  align-items: ${props => props.align || 'stretch'};
  justify-content: ${props => props.justify || 'stretch'};
  padding: ${props => props.padding || '0'};
`;

export default class Page extends Component {
  state = {
    menuValue: '',
    updatePrestoOpen: false,
    accountSettingsOpen: false,
    redirect: false,
  };

  handleMenuSelect = (e, { name, value }) => {
    console.log(name, value);
  };

  render() {
    const { children, loginRequired } = this.props;
    const { menuValue, accountSettingsOpen } = this.state;

    return (
      <AuthUser>
        {({ data, error, loading }) => {
          if (!loading && error && loginRequired) {
            return (
              <Container>
                <Index>
                  {error && <Message error>{error.message}</Message>}
                  <UserContext.Provider
                    value={{
                      data,
                      error,
                    }}
                  >
                    <Login />
                  </UserContext.Provider>
                </Index>
              </Container>
            );
          }

          if (!loading && error && !loginRequired) {
            return (
              <Container>
                <Index>
                  <UserContext.Provider
                    value={{
                      data,
                      error,
                    }}
                  >
                    {children}
                  </UserContext.Provider>
                </Index>
              </Container>
            );
          }

          if (!loading && data && data.status === 'success' && !loginRequired) {
            Router.replace('/dashboard');
          }

          if (!loading && data && data.status === 'success') {
            const {
              data: {
                user, balance, currentMonth, ytd,
              },
            } = data;

            console.log('Page:', data);
            const yearToDateBalance = ytd.reduce((count, curr) => count + curr.total, 0);
            const trigger = (
              <span>
                <Icon name="user" />
                {`Hello, ${user.firstName}`}
              </span>
            );

            return (
              <>
                <Meta />
                <Grid padded>
                  <Menu
                    size="massive"
                    pointing
                    fluid
                    secondary
                    style={{ backgroundColor: 'rgb(244, 243, 239)', paddingLeft: '100px' }}
                  >
                    <Menu.Item header>Dashboard</Menu.Item>
                    <Menu.Item active name="home" onClick={this.handleItemClick} />
                    <Menu.Item name="day" onClick={this.handleItemClick} />
                    <Menu.Item name="month" onClick={this.handleItemClick} />
                    <Menu.Item name="year" onClick={this.handleItemClick} />
                    <Menu.Item name="all time" onClick={this.handleItemClick} />

                    <Menu.Menu position="right">
                      <Menu.Item name="logout" onClick={this.handleItemClick} />
                    </Menu.Menu>
                  </Menu>
                </Grid>

                <div style={{ position: 'relative' }}>
                  <SideBar />
                </div>

                <Grid
                  columns={1}
                  style={{
                    backgroundColor: '#f4f3ef',
                    paddingLeft: '130px',
                    paddingRight: '30px',
                    boxShadow: '0 2px 2px hsla(38,16%,76%,.5)',
                  }}
                >
                  <Grid.Row>
                    {/* <Container>
                      <Menu attached="top" style={{ textAlign: 'right' }}>
                        <Dropdown
                          trigger={trigger}
                          pointing="top left"
                          direction="left"
                          icon={null}
                          name="user"
                          onClick={this.handleMenuSelect}
                        >
                          <Dropdown.Menu>
                            <Dropdown.Item disabled>
                              <span>
                                Signed in as
                                {' '}
                                <strong>{`${user.firstName} ${user.lastName}`}</strong>
                              </span>
                            </Dropdown.Item>
                            <AccountSettings
                              open={accountSettingsOpen}
                              user={data.data.user}
                              budget={data.data.budget || {}}
                            />
                            <UpdatePresto open={this.state.updatePrestoOpen} />
                            <Dropdown.Divider />
                            <Dropdown.Item
                              onClick={async () => {
                                requestApi.logout();
                                window.location.href = '/login';
                              }}
                            >
                              Log out
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </Menu>
                    </Container> */}
                  </Grid.Row>
                  <Grid.Row columns={1}>
                    <Grid.Column>
                      {/* <Grid.Row>

                    </Grid.Row> */}
                      <Grid.Row style={{ marginBottom: '20px' }}>
                        <Card.Group
                          centered
                          style={{ display: 'flex', flexDirection: 'row', alignItems: 'stretch' }}
                        >
                          <Statistic
                            label="Balance"
                            value={`$${Math.round(balance)}`}
                            extra={
                              currentMonth.currTransactions.length === 0
                                ? 'Never'
                                : moment(currentMonth.currTransactions[0].date).fromNow()
                            }
                            iconName="fa-4x fas fa-wallet"
                            isFontAwesome
                            iconColor="rgb(17, 187, 129)"
                          />
                          <Statistic
                            label="Last Charge"
                            value={`$${
                              currentMonth.currTransactions.length === 0
                                ? 'N/A'
                                : (currentMonth.currTransactions[0].amount / 100).toFixed(2)
                            }`}
                            extra={
                              currentMonth.currTransactions.length === 0
                                ? 'Never'
                                : moment(currentMonth.currTransactions[0].date).fromNow()
                            }
                            iconName="subway"
                            iconColor="yellow"
                          />
                          <Statistic
                            label="Spent"
                            value={`$${
                              yearToDateBalance === 0 ? 0 : Math.round(yearToDateBalance / 100)
                            }`}
                            extra="Since May 2018"
                            iconName="fire"
                            iconColor="orange"
                          />

                          {ytd
                            && ytd.map(item => (
                              <Statistic
                                key={item.type === 'Fare Payment' ? 'Fares' : 'Transfers'}
                                label={item.type === 'Fare Payment' ? 'Fares' : 'Transfers'}
                                iconName={
                                  item.type === 'Fare Payment'
                                    ? 'fa-4x fas fa-road'
                                    : 'fa-4x fas fa-map-signs'
                                }
                                iconColor={item.type === 'Fare Payment' ? '#3BB4E9' : '#5558c8'}
                                value={item.count}
                                isFontAwesome
                                extra="Since last year"
                              />
                            ))}
                        </Card.Group>
                      </Grid.Row>
                      <Grid.Row>
                        <UserContext.Provider
                          value={{ user: data.data.user, budget: data.data.budget }}
                        >
                          {children}
                        </UserContext.Provider>
                      </Grid.Row>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </>
            );
          }
        }}
      </AuthUser>
    );
  }
}

export {
  UserContext, FlexRow, Content, Container,
};
