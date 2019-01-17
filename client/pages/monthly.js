import Router from 'next/router';

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
        }
      }}
    </AuthUser>
  </>
);
