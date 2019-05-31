import React from 'react';
import PropTypes from 'prop-types';
import {
  Segment, Header, Container, Grid, Icon, Menu, Dropdown,
} from 'semantic-ui-react';
import AccountSettings from '../AccountSettings';
import UpdatePresto from './UpdatePresto';

const propTypes = {};

const defaultProps = {};

export default class User extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const options = [
      { key: 1, text: 'All Cards', value: 'all' },
      { key: 2, text: 'Card 1', value: 'Card 1' },
      { key: 3, text: 'Card 2', value: 'Card 2' },
    ];

    return (
      <>
        <Container>
          <Grid>
            <Grid.Row>
              <Header as="h2" style={{ fontWeight: 200 }}>
                Hey, Ian
              </Header>
            </Grid.Row>

            <Grid.Row>
              <Menu size="large" secondary text style={{ paddingBottom: '10px' }}>
                <Dropdown item inline options={options} defaultValue={options[0].value} />
                <Menu.Item name="this month" active onClick={this.handleItemClick} />
                <Menu.Item name="last month" onClick={this.handleItemClick} />
                <Menu.Item name="this year" onClick={this.handleItemClick} />
                <Menu.Item name="all time" onClick={this.handleItemClick} />

                {/* <Menu.Menu position="right">
              <Dropdown>
                <Dropdown.Menu
                  trigger={trigger}
                  pointing="top left"
                  direction="left"
                  icon={null}
                  name="user"
                  onClick={this.handleMenuSelect}
                >
                  <Dropdown.Item disabled>
                    <span>
                      Signed in as
                      {' '}
                      <strong>{`${user.firstName} ${user.lastName}`}</strong>
                    </span>
                  </Dropdown.Item>
                  <AccountSettings
                    open={accountSettingsOpen}
                    user={data.data.user}
                    budget={data.data.budget || {}}
                  />
                  <UpdatePresto open={this.state.updatePrestoOpen} />
                  <Dropdown.Divider />
                  <Dropdown.Item
                    onClick={async () => {
                      requestApi.logout();
                      window.location.href = '/login';
                    }}
                  >
                    Log out
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Menu.Menu> */}
              </Menu>
            </Grid.Row>
          </Grid>
        </Container>
      </>
    );
  }
}

User.propTypes = propTypes;
User.defaultProps = defaultProps;
