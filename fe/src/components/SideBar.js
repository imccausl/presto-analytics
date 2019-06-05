import React from "react";
import { Link } from "react-router-dom";
import { Menu, Icon, Rail, Segment } from "semantic-ui-react";
import styled from "styled-components";

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

// background: 'rgb(38,39,43)', color: 'rgb(209,211,212)'
export default props => {
  const { top } = props;

  // fontVariant: 'all-small-caps',
  return (
    <>
      <Menu
        fixed="left"
        icon="labeled"
        size="small"
        compact
        pointing
        secondary
        inverted
        vertical
        style={{
          background: "rgb(46,113,23)",
          color: "#333845",
          fontSize: "1rem",

          display: "flex",
          flexDirection: "column",
          alignContent: "center"
        }}>
        <div style={{ margin: "auto 0" }}>
          <Link href="/dashboard">
            <Menu.Item active onClick={handleClick}>
              <Icon name="dashboard" />
              {/* Dashboard */}
            </Menu.Item>
          </Link>
          <Link href="/monthly">
            <Menu.Item onClick={handleClick}>
              <Icon name="usd" />
              {/* Taps */}
            </Menu.Item>
          </Link>
          <Menu.Item>
            <Icon name="credit card" />
            {/* Transactions */}
          </Menu.Item>
          <Menu.Item>
            <Icon name="history" />
            {/* Budget */}
          </Menu.Item>
          <Menu.Item icon="list">
            <Icon name="list" />
            {/* Everything */}
          </Menu.Item>
        </div>
      </Menu>
    </>
  );
};
