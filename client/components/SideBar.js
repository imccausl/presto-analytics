import Link from 'next/link';
import { Menu, Icon } from 'semantic-ui-react';
import styled from 'styled-components';

const Nav = styled.nav`
  height: 100%;
  padding: 20px;
`;

const handleClick = (e) => {
  // console.dir(e.target);
  // if (e.target.name === 'Home') {
  //   Router.push('/dashboard');
  // } else {
  //   Router.push('/monthly');
  // }
};

export default props => (
  <Nav>
    <Menu secondary vertical>
      <Link href="/dashboard">
        <Menu.Item name="Home" icon="home" onClick={handleClick} />
      </Link>
      <Link href="/monthly">
        <Menu.Item name="Monthly Usage" icon="usd" onClick={handleClick} />
      </Link>
      <Menu.Item name="Reload History" icon="credit card" />
      <Menu.Item name="Trip History" icon="history" />
      <Menu.Item name="All Transactions" icon="list" />
    </Menu>
  </Nav>
);
