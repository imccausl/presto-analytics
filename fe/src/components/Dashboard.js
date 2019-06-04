import moment from "moment";
import React from "react";
import { Grid, Container, Header } from "semantic-ui-react";
import { Route, Redirect } from "react-router-dom";

import DataFilter, {
  SEARCH_TYPE_RANGE,
  SEARCH_TYPE_MONTH
} from "./dashboard/DataFilter";
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
              lastName={user.lastName}
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
            <Route path="/dashboard/:cardNumber/:searchType/:yearOrRange/:monthOrUnit">
              {({ match, history }) => {
                console.log(match, history);
                let cardNumber;
                let searchType;
                let yearOrRange;
                let monthOrUnit;

                if (match) {
                  cardNumber = match.params.cardNumber;
                  searchType =
                    match.params.searchType === SEARCH_TYPE_RANGE ||
                    match.params.searchType === SEARCH_TYPE_MONTH
                      ? match.params.searchType
                      : "err";
                  yearOrRange = Math.abs(
                    parseInt(match.params.yearOrRange, 10)
                  );
                  monthOrUnit =
                    match.params.monthOrUnit !== "days"
                      ? Math.abs(parseInt(match.params.monthOrUnit, 10))
                      : "days";
                } else {
                  //defaults
                  cardNumber = "all";
                  searchType = SEARCH_TYPE_RANGE;
                  yearOrRange = 30;
                  monthOrUnit = "days";

                  return (
                    <Redirect
                      to={`/dashboard/${cardNumber}/${searchType}/${yearOrRange}/${monthOrUnit}`}
                    />
                  );
                }

                return (
                  <DataFilter
                    cards={user.cards}
                    history={history}
                    match={match}
                    cardNumber={cardNumber}
                    searchType={searchType}
                    yearOrRange={yearOrRange}
                    monthOrUnit={monthOrUnit}>
                    {({ data, error, loading }) => {
                      console.log(data);
                      return (
                        <>
                          {!loading && !error && (
                            <Header as="h2">
                              {data.data.transactions.length === 0
                                ? "No Transactions For This Period"
                                : `${moment(
                                    data.data.transactions[0].date
                                  ).format("MMMM DD YYYY")} - ${moment(
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
                );
              }}
            </Route>
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
