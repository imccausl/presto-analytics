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

export default props => {
  const { top } = props;

  return (
    <Menu icon="labeled" fixed="left" pointing vertical inverted style={{ zIndex: '100' }}>
      <Menu.Item header>
        <div style={{ padding: '15px 0' }}>
          <i className="far fa-compass fa-5x" />
        </div>
      </Menu.Item>

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
};
