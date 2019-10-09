import React from 'react';
import PropTypes from 'prop-types';

import AccountSettings from '../components/AccountSettings';
import Page, { UserContext } from '../components/Page';

const propTypes = {};

const defaultProps = {};

export default function Settings() {
  return (
    <Page loginRequired>
      <UserContext.Consumer>
        {data => {
          console.log(data);
          return <AccountSettings props={data} />;
        }}
      </UserContext.Consumer>
    </Page>
  );
}

Settings.propTypes = propTypes;
Settings.defaultProps = defaultProps;
