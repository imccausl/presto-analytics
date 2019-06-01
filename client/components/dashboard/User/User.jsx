import moment from 'moment';
import PropTypes from 'prop-types';
import { Header, Container, Grid } from 'semantic-ui-react';

import DataFilter from '../DataFilter';
import SmallStatistic from '../../styled/SmallStatistic';

const propTypes = {};
const defaultProps = {};

export default class User extends React.Component {
  constructor(props) {
    super(props);
    this.state = { activeSelection: 'this month' };
  }

  render() {
    const {
      firstName, cards, balance, budget, lastActivity, amount, since,
    } = this.props;

    return (
      <>
        <Container>
          <Grid>
            <Grid.Row>
              <Header as="h2" style={{ fontWeight: 200 }}>
                Hey,
                {' '}
                {firstName}
              </Header>
            </Grid.Row>
            <Grid.Row>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: '100%',
                }}
              >
                <SmallStatistic
                  header="Balance"
                  body={`$${(Math.round(balance * 100) / 100).toFixed(2)}`}
                  footer={`over ${cards.length} card${cards.length !== 1 ? 's' : ''}`}
                />
                <SmallStatistic
                  header="Spent"
                  body={`$${Math.round(amount / 100)}`}
                  footer={`since ${moment(since).format('MMM YYYY')}`}
                />
                <SmallStatistic
                  header="Last Charge"
                  body={`$${parseFloat(lastActivity.amount / 100).toFixed(2)}`}
                  footer={`${moment(lastActivity.date).fromNow()}`}
                />
                <SmallStatistic
                  header="Location"
                  body={lastActivity.location}
                  footer={`${moment(lastActivity.date).fromNow()}`}
                />
                <SmallStatistic header="Updated" body={moment(lastActivity.updated_at).fromNow()} />
              </div>
            </Grid.Row>

            <Grid.Row>
              <DataFilter cards={cards} />

              {/* activeIndex={activeIndex}
                        panes={panes}
                        onTabChange={(e, tab) => {
                          if (tab.activeIndex === 0) {
                            this.setState({
                              month: thisMonth,
                              year: thisYear,
                            });
                          } else if (tab.activeIndex === 1) {
                            this.setState({
                              month: thisMonth === 0 ? 11 : thisMonth - 1,
                              year: thisMonth === 0 ? thisYear - 1 : thisYear,
                            });
                          } else if (tab.activeIndex === 2) {
                            this.setState({ open: true });
                          }

                          this.setState({ activeIndex: tab.activeIndex }); */}

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
            </Grid.Row>
          </Grid>
        </Container>
      </>
    );
  }
}

User.propTypes = propTypes;
User.defaultProps = defaultProps;
