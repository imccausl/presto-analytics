import React from "react";
import { Grid, Container, Segment } from "semantic-ui-react";

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
          <Grid.Row>
            <DataFilter cards={user.cards}>
              {({ data, error, loading }) => {
                console.log(data);
                return (
                  <>
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
