import Link from 'next/link';
import { Menu, Icon } from 'semantic-ui-react';
import styled from 'styled-components';

const Nav = styled.nav`
  height: 100%;
  padding: 20px;
`;

const handleClick = e => {
  // console.dir(e.target);
  // if (e.target.name === 'Home') {
  //   Router.push('/dashboard');
  // } else {
  //   Router.push('/monthly');
  // }
};

export default props => (
  <Menu icon="labeled" compact size="large" fixed="left" pointing vertical inverted>
    <Link href="/dashboard">
      <Menu.Item active onClick={handleClick}>
        <Icon name="dashboard" />
      </Menu.Item>
    </Link>
    <Link href="/monthly">
      <Menu.Item icon="usd" onClick={handleClick} />
    </Link>
    <Menu.Item icon="credit card" />

    <Menu.Item icon="history" />

    <Menu.Item icon="list" />
  </Menu>
);
