import Router from 'next/router';

import AuthUser from '../components/AuthUser';

export default () => (
  <>
    <AuthUser>
      {({ data, error, loading }) => {
        if (!loading) {
          if (data) {
            Router.push('/dashboard');
          }

          if (error) Router.push('/login');
        }
      }}
    </AuthUser>
  </>
);
