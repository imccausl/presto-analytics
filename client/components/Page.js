import moment from 'moment';
import React, { Component } from 'react';
import Router from 'next/router';
import { Message, Container } from 'semantic-ui-react';
import styled, { ThemeProvider, injectGlobal } from 'styled-components';
import PropTypes from 'prop-types';

import Index from './Index';
import AuthUser from './AuthUser';
import Login from './Login';
import Meta from './Meta';

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
            // rgb(244, 243, 239)
            return (
              <>
                <Meta />
                <UserContext.Provider
                  value={{
                    data: data.data,
                  }}
                >
                  {children}
                </UserContext.Provider>
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
