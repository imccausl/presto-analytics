import moment from 'moment';
import React from 'react';
import { Grid, Header, Divider } from 'semantic-ui-react';
import { Route, Redirect } from 'react-router-dom';

import DataFilter, { SEARCH_TYPE_RANGE, SEARCH_TYPE_MONTH } from './dashboard/DataFilter';
import FilteredStats from './dashboard/FilteredStats';
import MonthlyOverview from './dashboard/MonthlyOverview';
import RecentActivity from './dashboard/RecentActivity';
import TapList from './dashboard/TapList';
import TopTapOrigins from './dashboard/TopTapOrigins';
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
      <Route path="/dashboard/:cardNumber/:searchType/:yearOrRange/:monthOrUnit">
        {({ match, history }) => {
          console.log(match, history);
          let cardNumber;
          let searchType;
          let yearOrRange;
          let monthOrUnit;

          if (match) {
            cardNumber = match.params.cardNumber;
            searchType = match.params.searchType === SEARCH_TYPE_RANGE
              || match.params.searchType === SEARCH_TYPE_MONTH
              ? match.params.searchType
              : 'err';
            yearOrRange = Math.abs(parseInt(match.params.yearOrRange, 10));
            monthOrUnit = match.params.monthOrUnit !== 'days'
              ? Math.abs(parseInt(match.params.monthOrUnit, 10))
              : 'days';
          } else {
            // defaults
            cardNumber = 'all';
            searchType = SEARCH_TYPE_RANGE;
            yearOrRange = 30;
            monthOrUnit = 'days';

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
              monthOrUnit={monthOrUnit}
            >
              {({ data, error, loading }) => {
                console.log(data);
                return (
                  <Grid columns="equal">
                    <Grid.Row>
                      <Grid.Column>
                        <MonthlyOverview
                          data={data}
                          error={error}
                          loading={loading}
                          budget={budget || {}}
                        />
                      </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                      <Grid.Column>
                        <FilteredStats data={data} error={error} loading={loading} />
                      </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                      <Grid.Column>
                        <TopTapOrigins data={data} error={error} loading={loading} />
                      </Grid.Column>
                      <Grid.Column />
                    </Grid.Row>
                    <Divider horizontal>
                      <Header as="h3">
                        Year Overview
                        <Header.Subheader>Year To Month Overview</Header.Subheader>
                      </Header>
                    </Divider>
                    <Grid.Row>
                      <Grid.Column>
                        <YearOverview />
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                );
              }}
            </DataFilter>
          );
        }}
      </Route>
    </>
  );
};

export default Dashboard;
