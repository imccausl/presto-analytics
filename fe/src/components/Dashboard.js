import moment from "moment";
import React from "react";
import { Grid, Container, Header } from "semantic-ui-react";

import DataFilter from "./dashboard/DataFilter";
import FilteredStats from "./dashboard/FilteredStats";
import MonthlyOverview from "./dashboard/MonthlyOverview";
import SideBar from "./SideBar";
import User from "./dashboard/User";
import YearOverview from "./dashboard/YearOverview";

const Dashboard = props => {
  const {
    props: {
      data: {
        user,
        balance,
        budget,
        lastActivity,
        spent: { amount, since }
      }
    }
  } = props;

  return (
    <>
      <div style={{ position: "relative" }}>
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
              amount={since ? amount : "N/A"}
              since={since || "Never"}
              lastActivity={
                lastActivity.length === 0
                  ? { amount: "Never", location: "N/A", date: "Never" }
                  : lastActivity[0]
              }
            />
          </Grid.Row>
          <Grid.Row style={{ marginTop: "20px" }}>
            <DataFilter cards={user.cards}>
              {({ data, error, loading }) => {
                console.log(data);
                return (
                  <>
                    {!loading && !error && (
                      <Header as="h2">
                        {`${moment(data.data.transactions[0].date).format(
                          "MMMM DD YYYY"
                        )} - ${moment(
                          data.data.transactions[
                            data.data.transactions.length - 1
                          ].date
                        ).format("MMMM DD YYYY")}`}
                        <Header.Subheader>
                          Some kind of text will go here
                        </Header.Subheader>
                      </Header>
                    )}

                    <MonthlyOverview
                      data={data}
                      error={error}
                      loading={loading}
                      budget={budget || {}}
                    />
                    <FilteredStats
                      data={data}
                      error={error}
                      loading={loading}
                    />
                  </>
                );
              }}
            </DataFilter>

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
          <Grid.Row style={{ marginTop: "20px" }}>
            <Header as="h2">
              Year Overview
              <Header.Subheader>
                Some kind of text will go here
              </Header.Subheader>
            </Header>
            <YearOverview budget={budget} />
          </Grid.Row>
        </Container>
      </Grid>
    </>
  );
};

export default Dashboard;
