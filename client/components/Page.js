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
                <SideBar />
                <Grid columns={1} style={{ backgroundColor: '#f4f3ef' }}>
                  <Grid.Column>
                    {/* <Grid.Row>
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
                    </Grid.Row> */}
                    <div style={{ marginLeft: '210px', padding: '10px' }}>
                      <Grid.Row style={{ marginBottom: '20px' }}>
                        <Card.Group centered>
                          <Statistic
                            label="Balance"
                            value={`$${Math.round(balance)}`}
                            extra={
                              currentMonth.currTransactions.length === 0
                                ? 'Never'
                                : moment(currentMonth.currTransactions[0].date).fromNow()
                            }
                            iconName="credit card alternative"
                            iconColor="olive"
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
                          <Statistic
                            label="Trips"
                            value={`${
                              yearToDateBalance === 0 ? 0 : Math.round(yearToDateBalance / 100)
                            }`}
                            extra="Since January 2018"
                            iconName="map outline"
                            iconColor="green"
                          />
                        </Card.Group>
                      </Grid.Row>
                      <Grid.Row>
                        <UserContext.Provider
                          value={{ user: data.data.user, budget: data.data.budget }}
                        >
                          {children}
                        </UserContext.Provider>
                      </Grid.Row>
                    </div>
                  </Grid.Column>
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
