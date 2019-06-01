import { Grid, Container, Segment } from 'semantic-ui-react';

import DataFilter from './dashboard/DataFilter';
import MonthlyOverview from './dashboard/MonthlyOverview';
import SideBar from './SideBar';
import Statistic from './styled/Statistic';
import User from './dashboard/User';
import YearOverview from './dashboard/YearOverview';

const Dashboard = props => {
  const {
    props: {
      data: {
        user,
        balance,
        budget,
        lastActivity,
        spent: { amount, since },
      },
    },
  } = props;

  return (
    <>
      <div style={{ position: 'relative' }}>
        <SideBar />
      </div>
      <Grid padded>
        <Container>
          <Grid.Row>
            <User
              firstName={user.firstName}
              cards={user.cards}
              balance={balance}
              budget={budget}
              amount={since ? amount : 'N/A'}
              since={since || 'Never'}
              lastActivity={
                lastActivity.length === 0
                  ? { amount: 'Never', location: 'N/A', date: 'Never' }
                  : lastActivity[0]
              }
            />
          </Grid.Row>
          <Grid.Row>
            <DataFilter cards={user.cards}>
              <MonthlyOverview year="2019" month={4} budget={budget || {}} />
            </DataFilter>

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
        </Container>
      </Grid>

      {/* <Grid
        columns={1}
        style={{
          backgroundColor: '#f4f3ef',
          paddingLeft: '130px',
          paddingRight: '30px',
          // boxShadow: '0 2px 2px hsla(38,16%,76%,.5)',
        }}
      >
        <Grid.Row columns={1}>
          <Grid.Column>
            <Card.Group
              centered
              style={{ display: 'flex', flexDirection: 'row', alignItems: 'stretch' }}
            >
              <Statistic
                label="Balance"
                value={`$${Math.round(balance)}`}
                extra={
                  currentMonth.currTransactions.length === 0
                    ? 'Never'
                    : moment(currentMonth.currTransactions[0].date).fromNow()
                }
                iconName="ti-wallet"
                isCustomIcon
                iconColor="rgb(17, 187, 129)"
              />
              <Statistic
                label="Last Charge"
                value={`$${
                  currentMonth.currTransactions.length === 0
                    ? 'N/A'
                    : (currentMonth.currTransactions[0].amount / 100).toFixed(2)
                }`}
                extra={
                  currentMonth.currTransactions.length === 0
                    ? 'Never'
                    : moment(currentMonth.currTransactions[0].date).fromNow()
                }
                iconName="bus"
                iconColor="yellow"
              />
              <Statistic
                label="Spent"
                value={`$${
                  yearToDateBalance(ytd) === 0 ? 0 : Math.round(yearToDateBalance(ytd) / 100)
                }`}
                extra="Since May 2018"
                isCustomIcon
                iconName="ti-credit-card"
                iconColor="orange"
              />

              {ytd
                && ytd.map(item => (
                  <Statistic
                    key={item.type === 'Fare Payment' ? 'Fares' : 'Transfers'}
                    label={item.type === 'Fare Payment' ? 'Fares' : 'Transfers'}
                    iconName={item.type === 'Fare Payment' ? 'ti-ticket' : 'ti-vector'}
                    iconColor={item.type === 'Fare Payment' ? '#3BB4E9' : '#5558c8'}
                    value={item.count}
                    isCustomIcon
                    extra="Since last year"
                  />
                ))}
            </Card.Group>

            <Segment vertical>
              <YearOverview budget={budget || {}} />
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid> */}
    </>
  );
};

export default Dashboard;
