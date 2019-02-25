import moment from 'moment';
import React, { Component } from 'react';
import Router from 'next/router';
import {
  Dropdown, Icon, Dimmer, Loader, Button, Menu, Message,
} from 'semantic-ui-react';
import styled, { ThemeProvider, injectGlobal } from 'styled-components';
import PropTypes from 'prop-types';

import AccountSettings from './AccountSettings';
import Index from './Index';
import AuthUser from './AuthUser';
import HeaderBar from './styled/HeaderBar';
import Login from './Login';
import Meta from './Meta';
import SideBar from './SideBar';
import PageContainer from './styled/Container';
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

const Container = styled.div`
  display: block;
  height: 100vh;
  color: black;
`;

const Main = styled.main`
  border-radius: 0.7em;
  margin-left: 30px;
  min-height: 400px;
  margin-right: 15px;
  /* border: 1px solid lightgrey; */
  background: white;
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

            const trigger = (
              <span>
                <Icon name="user" />
                {`Hello, ${user.firstName}`}
              </span>
            );

            return (
              <>
                <Meta />
                <FlexRow>
                  <SideBar />
                  <PageContainer>
                    <Content>
                      <HeaderBar>
                        <FlexRow justify="flex-end" padding="5px 20px" style={{ color: 'white' }}>
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
                        </FlexRow>
                      </HeaderBar>

                      <div
                        style={{
                          position: 'absolute',
                          zIndex: '1',
                          marginTop: '5px',
                          width: '100%',
                        }}
                      >
                        <FlexRow>
                          <Statistic label="Total Balance" value={balance} />
                          <Statistic
                            label="Last Charge"
                            value={`$${
                              currentMonth.currTransactions.length === 0
                                ? 0
                                : currentMonth.currTransactions[0].amount
                            }`}
                          />
                          <Statistic
                            label="Year To Date"
                            value={`$${ytd.reduce((count, curr) => count + curr.total, 0) || 0}`}
                          />
                          <Statistic
                            label="Last Update"
                            value={
                              currentMonth.currTransactions.length === 0
                                ? 'Never'
                                : moment(currentMonth.currTransactions[0].date).fromNow()
                            }
                          />
                        </FlexRow>

                        <Container>
                          <Main>
                            <UserContext.Provider
                              value={{ user: data.data.user, budget: data.data.budget }}
                            >
                              {children}
                            </UserContext.Provider>
                          </Main>
                        </Container>
                      </div>
                    </Content>
                  </PageContainer>
                </FlexRow>
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
