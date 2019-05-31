import moment from 'moment';
import PropTypes from 'prop-types';
import {
  Segment, Header, Container, Grid, Icon, Menu, Dropdown,
} from 'semantic-ui-react';

import AccountSettings from '../AccountSettings';
import SmallStatistic from '../styled/SmallStatistic';
import UpdatePresto from './UpdatePresto';

const propTypes = {};

const defaultProps = {};

function makeCardMenuData(cards) {
  const options = cards.map((card, index) => ({
    key: cards.length > 1 ? index + 2 : index + 1,
    text: card.cardNumber,
    value: card.cardNumber,
  }));

  if (cards.length > 1) {
    options.unshift({ key: 1, text: 'All Cards', value: 'all' });
  }

  return options;
}
export default class User extends React.Component {
  constructor(props) {
    super(props);
    this.state = { activeSelection: 'this month' };

    this.handleItemClick = this.handleItemClick.bind(this);
  }

  handleItemClick(event) {
    this.setState({ activeSelection: event.target.textContent.toLowerCase() });
  }

  render() {
    const { activeSelection } = this.state;
    const {
      firstName, cards, lastTap, balance,
    } = this.props;
    const options = makeCardMenuData(cards);

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
                <SmallStatistic label="Balance" value={`$${Math.round(balance)}`} />
                <SmallStatistic
                  label="Last Charge"
                  value={`$${parseFloat(lastTap.amount / 100).toFixed(2)}`}
                />
                <SmallStatistic label="Charged" value={moment(lastTap.date).fromNow()} />
                <SmallStatistic label="Location" value={lastTap.location} />
              </div>
            </Grid.Row>

            <Grid.Row>
              <Menu size="large" secondary text style={{ paddingBottom: '10px' }}>
                <Dropdown item inline options={options} defaultValue={options[0].value} />
                <Menu.Item
                  name="this month"
                  active={activeSelection === 'this month'}
                  onClick={this.handleItemClick}
                />
                <Menu.Item
                  name="last month"
                  active={activeSelection === 'last month'}
                  onClick={this.handleItemClick}
                />
                <Menu.Item
                  name="this year"
                  active={activeSelection === 'this year'}
                  onClick={this.handleItemClick}
                />
                <Menu.Item
                  name="all time"
                  active={activeSelection === 'all time'}
                  onClick={this.handleItemClick}
                />

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
