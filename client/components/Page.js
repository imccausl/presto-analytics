import moment from 'moment';
import React from 'react';
import {
  Dropdown, Icon, Dimmer, Loader, Button, Menu,
} from 'semantic-ui-react';
import styled, { ThemeProvider, injectGlobal } from 'styled-components';
import PropTypes from 'prop-types';

import AuthUser from './AuthUser';
import Meta from './Meta';
import HeaderBar from './styled/HeaderBar';
import SideBar from './SideBar';
import Statistic from './styled/Statistic';
import PageContainer from './styled/Container';

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
  margin-top: 10px;
  color: black;
`;

const Main = styled.main`
  border-radius: 0.5em;
  margin-left: 30px;
  min-height: 400px;
  margin-right: 15px;
  border: 1px solid lightgrey;
  background: white;
`;

const FlexRow = styled.div`
  display: flex;
  position: relative;
  width: ${props => props.width || '100%'};
  flex-direction: row;
  align-items: ${props => props.align || 'stretch'};
  justify-content: ${props => props.justify || 'stretch'};
  padding: ${props => props.padding || '0'};
`;

const Page = (props) => {
  const { children } = props;

  return (
    <AuthUser>
      {({ data, error, loading }) => {
        console.log(data);

        if (error) {
          return <div>{error.message}</div>;
        }

        if (!loading) {
          const {
            data: { user, currentMonth, ytd },
          } = data;
          const options = [
            {
              key: 'user',
              text: (
                <span>
                  Signed in as
                  {' '}
                  <strong>{`${user.firstName} ${user.lastName}`}</strong>
                </span>
              ),
              disabled: true,
            },
            { key: 'Details', text: 'Account Settings' },
            { key: 'Refresh', text: 'Refresh Data' },
            { key: 'divider', text: <Dropdown.Divider />, disabled: true },
            { key: 'Logout', text: 'Log out' },
          ];

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
                          options={options}
                          pointing="top left"
                          direction="left"
                          icon={null}
                        />
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
                        <Statistic label="Card Balance" value={user.balance} />
                        <Statistic
                          label="Last Charge"
                          value={`$${currentMonth.currTransactions[0].amount}`}
                        />
                        <Statistic
                          label="Year To Date"
                          value={`$${ytd.reduce((count, curr) => count + curr.total, 0)}`}
                        />
                        <Statistic
                          label="Last Update"
                          value={moment(currentMonth.currTransactions[0].date).fromNow()}
                        />
                      </FlexRow>

                      <Container>
                        <Main>
                          <UserContext.Provider value={{ data }}>{children}</UserContext.Provider>
                        </Main>
                      </Container>
                    </div>
                  </Content>
                </PageContainer>
              </FlexRow>
            </>
          );
        }

        return (
          <Dimmer active>
            <Loader />
          </Dimmer>
        );
      }}
    </AuthUser>
  );
};

export default Page;
export { UserContext, FlexRow };
