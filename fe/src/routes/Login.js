import React from "react";
import PropTypes from "prop-types";

import LoginPage from "../components/Login";
import Page from "../components/Page";

const propTypes = {};

const defaultProps = {};

export default function Login(props) {
  return (
    <Page loginRequired={false}>
      <LoginPage />
    </Page>
  );
}

Login.propTypes = propTypes;
Login.defaultProps = defaultProps;
