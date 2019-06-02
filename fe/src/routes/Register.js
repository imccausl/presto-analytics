import React from "react";
import PropTypes from "prop-types";

import Page from "../components/Page";
import RegisterPage from "../components/Register";

const propTypes = {};
const defaultProps = {};

export default function Register(props) {
  return (
    <Page>
      <RegisterPage />
    </Page>
  );
}

Register.propTypes = propTypes;
Register.defaultProps = defaultProps;
