import Router from 'next/router';
import { Loader } from 'semantic-ui-react';

import Page from '../components/Page';
import MonthlyListing from '../components/dashboard/MonthlyListing';

export default () => (
  <Page loginRequired>
    <MonthlyListing />
  </Page>
);
