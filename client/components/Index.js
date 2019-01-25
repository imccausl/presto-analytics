import { Header, Button, Icon } from 'semantic-ui-react';
import styled from 'styled-components';

import HeaderBar from './styled/HeaderBar';
import Meta from './Meta';
import { FlexRow } from './Page';

const Flex = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  padding-top: 10px;
  background: #74c35a;
`;

const Index = props => (
  <Container>
    <Meta />
    <div style={{ position: 'relative', maxHeight: '60px' }}>
      <HeaderBar>
        <FlexRow justify="space-around" align="center" padding="0 0 0 10px">
          <Header style={{ width: '100%', marginBottom: '0' }} as="h1">
            Presto Analytics
          </Header>
          <FlexRow justify="flex-end" padding="0 10px 0 0">
            <Button inverted icon labelPosition="left">
              Log In
              <Icon name="sign in" />
            </Button>
            <Button inverted icon labelPosition="left">
              Sign Up
              <Icon name="at" />
            </Button>
          </FlexRow>
        </FlexRow>
      </HeaderBar>
    </div>
    <Flex>{props.children}</Flex>
  </Container>
);

export default Index;
