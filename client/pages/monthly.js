import Router from 'next/router';
import { Loader } from 'semantic-ui-react';

import AuthUser from '../components/AuthUser';
import MonthlyListing from '../components/dashboard/MonthlyListing';

export default () => (
  <>
    <AuthUser>
      {({ data, error, loading }) => {
        if (!loading) {
          if (data) {
            return <MonthlyListing />;
          }

          if (error) Router.push('/login');

          if (loading) return <Loader active />;
        }
      }}
    </AuthUser>
  </>
);
