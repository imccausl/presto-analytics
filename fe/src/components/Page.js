import React, { Component, createRef } from 'react';
import {
  Message, Container, Grid, Sticky, Ref,
} from 'semantic-ui-react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import Index from './Index';
import AuthUser from './AuthUser';
import Login from './Login';
import SideBar from './SideBar';
import User from './dashboard/User';

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

  contextRef = createRef();

  render() {
    const { children, loginRequired } = this.props;
    const { menuValue, accountSettingsOpen } = this.state;

    return (
      <AuthUser>
        {({ data, error, loading }) => {
          if (!loading && error && loginRequired) {
            return (
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
            );
          }

          if (!loading && error && !loginRequired) {
            return (
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
            );
          }

          if (!loading && data && data.status === 'success') {
            const {
              data: {
                user,
                budget,
                balance,
                lastActivity,
                spent: { amount, since },
              },
            } = data;
            console.log(data);
            return (
              <>
                <SideBar />
                <Ref innerRef={this.contextRef}>
                  <Grid style={{ paddingTop: 0 }}>
                    <Grid.Row>
                      <Grid.Column>
                        <Sticky context={this.contextRef}>
                          <User
                            firstName={user.firstName}
                            lastName={user.lastName}
                            cards={user.cards}
                            balance={balance}
                            budget={budget}
                            amount={since ? amount : 'N/A'}
                            since={since || 'Never'}
                            lastActivity={
                              lastActivity.length === 0
                                ? { amount: 'Never', location: 'N/A', date: 'Never' }
                                : lastActivity[0]
                            }
                          />
                        </Sticky>
                      </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                      <Grid.Column style={{ marginLeft: '80px', marginRight: '10px' }}>
                        <UserContext.Provider
                          value={{
                            data: data.data,
                          }}
                        >
                          {children}
                        </UserContext.Provider>
                      </Grid.Column>
                    </Grid.Row>
                    {/*
                 * May move these to a different route
                 <Grid.Row style={{ marginTop: "20px" }}>
                 <Header as="h2">
                 Year Overview
                 <Header.Subheader>
                 Some kind of text will go here
                 </Header.Subheader>
                 </Header>
                 <YearOverview budget={budget} />
                </Grid.Row> */}
                  </Grid>
                </Ref>
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
