import React from 'react';
import {
  Dropdown, Icon, Dimmer, Loader,
} from 'semantic-ui-react';
import styled, { ThemeProvider, injectGlobal } from 'styled-components';
import PropTypes from 'prop-types';

import AuthUser from './AuthUser';
import Meta from './Meta';
import HeaderBar from './styled/HeaderBar';
import SideBar from './SideBar';

const UserContext = React.createContext();

const Content = styled.div`
  position: relative;
  width: 100%;
  z-index: 10;
`;

const FlexRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: stretch;
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
            data: { user },
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
            },
            { key: 'Details', text: 'Account Details' },
            { key: 'Refresh', text: 'Refresh Data' },
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
                <Content>
                  <HeaderBar>
                    <FlexRow justify="flex-end" padding="5px 20px" style={{ color: 'white' }}>
                      <Dropdown trigger={trigger} options={options} direction="left" />
                    </FlexRow>
                  </HeaderBar>

                  <div style={{ position: 'relative', zIndex: '10', marginTop: '-460px' }}>
                    <UserContext.Provider value={{ data }}>{children}</UserContext.Provider>
                  </div>
                </Content>
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
export { UserContext };
