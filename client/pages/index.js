import Router from 'next/router';

import AuthUser from '../components/AuthUser';
import withAuth from '../lib/withAuth';

const Index = (props) => {
  console.log(props);
  return (
    <>
      <AuthUser>
        {({ data, error, loading }) => {
          console.log(data, error, loading);

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
};

export default Index;
