import { Menu, Icon } from 'semantic-ui-react';
import styled from 'styled-components';

const Nav = styled.nav`
  height: 100%;
  padding: 20px;
`;

export default props => (
  <Nav>
    <Menu secondary vertical>
      <Menu.Item name="Home" icon="home" active />
      <Menu.Item name="Budget" icon="usd" />
      <Menu.Item name="Reload History" icon="credit card" />
      <Menu.Item name="Trip History" icon="history" />
      <Menu.Item name="All Transactions" icon="list" />
    </Menu>
  </Nav>
);
