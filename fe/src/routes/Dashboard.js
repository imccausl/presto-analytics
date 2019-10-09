import React from "react";
import PropTypes from "prop-types";

import MainDashboard from "../components/Dashboard";
import Page, { UserContext } from "../components/Page";

const propTypes = {};

const defaultProps = {};

export default function Dashboard(props) {
  return (
    <Page loginRequired>
      <UserContext.Consumer>
        {data => <MainDashboard props={data} />}
      </UserContext.Consumer>
    </Page>
  );
}

Dashboard.propTypes = propTypes;
Dashboard.defaultProps = defaultProps;
