import React from "react";
import Fetch from "react-fetch-component";
import { Segment, Label, Loader } from "semantic-ui-react";
import styled from "styled-components";

import API from "../../lib/api";

import { FlexRow } from "../Page";
import MonthlyTapGraph from "./MonthlyTapGraph";
import Statistic from "../styled/Statistic";

export default props => {
  const { year } = props;

  return (
    <Fetch
      url={`${API.root}${API.allTransactions.endpoint}`}
      options={API.send(API.allTransactions.method)}>
      {({ loading, data, error }) => {
        if (loading) {
          return <Loader active />;
        }

        if (!loading && data) {
          const year = "2018";

          const months = Object.keys(data.data[year]).map(month => {
            const monthData = data.data[year][month];

            return (
              <div style={{ margin: "10px" }}>
                <Segment>
                  <Label color="orange" attached="top left">
                    {`${month} ${year}`}
                  </Label>
                  <FlexRow justify="space-between">
                    <FlexRow align="center" justify="flex-start">
                      <Statistic
                        label="Spent"
                        value={`$${monthData.amount +
                          monthData.transitPassAmount}`}
                      />
                      <Statistic
                        label="Taps"
                        value={monthData.transactions.length}
                      />
                    </FlexRow>
                    <MonthlyTapGraph data={monthData} />
                  </FlexRow>
                </Segment>
              </div>
            );
          });

          return months;
        }
      }}
    </Fetch>
  );
};
