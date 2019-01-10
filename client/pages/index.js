import NProgress from 'nprogress';
import AuthUser from '../components/AuthUser';

export default () => (
  <>
    <AuthUser>
      {({ data, error, loading }) => {
        if (!loading) {
          console.log(data);
        }
      }}
    </AuthUser>
  </>
);
