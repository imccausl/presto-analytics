import styled, { ThemeProvider, injectGlobal } from 'styled-components';
import PropTypes from 'prop-types';

import Meta from './Meta';
import HeaderBar from './styled/HeaderBar';
import SideBar from './SideBar';

const Content = styled.div`
  position: relative;
  width: 100%;
  z-index: 10;
`;

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: stretch;
`;
const Page = (props) => {
  const { children } = props;

  return (
    <>
      <Meta />
      <Container>
        <SideBar />
        <Content>
          <HeaderBar />
          <div style={{ position: 'relative', zIndex: '10', marginTop: '-460px' }}>{children}</div>
        </Content>
      </Container>
    </>
  );
};

export default Page;
