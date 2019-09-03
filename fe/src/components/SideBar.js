import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import {
  Menu, Icon, Rail, Segment,
} from 'semantic-ui-react';
import styled from 'styled-components';

import AccountSettings from './AccountSettings';
import UpdatePresto from './dashboard/UpdatePresto';

import requestApi from '../lib/requestApi';

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
class SideBar extends Component {
  state = {
    activeSelection: 'this month',
    accountModalOpen: false,
    prestoModalOpen: false,
  };

  handleItemClick = async (e, { name }) => {
    if (name === 'update') {
      this.setState({ prestoModalOpen: true });
    }

    if (name === 'logout') {
      await requestApi.logout();
      this.props.history.push('/login');
    }

    if (name === 'settings') {
      this.setState({ accountModalOpen: true });
    }
  };

  handleAccountModalClose = () => {
    this.setState({ accountModalOpen: false });
  };

  handlePrestoModalClose = () => {
    this.setState({ prestoModalOpen: false });
  };

  render() {
    const { top, budget } = this.props;
    const { prestoModalOpen, accountModalOpen } = this.state;

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
            background: 'rgb(36,41,46)',
            color: '#333845',
            fontSize: '1rem',

            display: 'flex',
            flexDirection: 'column',
            alignContent: 'center',
          }}
        >
          <div style={{ margin: 'auto 0', width: '65px' }}>
            <Menu.Item header>
              {/* <Icon name="user circle outline" size="large" />{" "}
            {`  ${firstName} ${lastName}`} */}
            </Menu.Item>

            <Menu.Menu position="right">
              <Menu.Item name="update" onClick={this.handleItemClick}>
                <Icon name="refresh" size="large" />
              </Menu.Item>

              <Menu.Item name="settings" onClick={this.handleItemClick}>
                <Icon name="setting" size="large" />
              </Menu.Item>

              <Menu.Item name="logout" onClick={this.handleItemClick}>
                <Icon name="log out" size="large" />
              </Menu.Item>
            </Menu.Menu>
          </div>
        </Menu>

        <UpdatePresto open={prestoModalOpen} close={this.handlePrestoModalClose} />
        <AccountSettings
          open={accountModalOpen}
          user={this.props}
          budget={budget || {}}
          close={this.handleAccountModalClose}
        />
      </>
    );
  }
}

export default withRouter(SideBar);
