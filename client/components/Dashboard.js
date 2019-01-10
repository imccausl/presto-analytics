import AuthUser from './AuthUser';
import Summary from './dashboard/Summary';
import MonthlyStats from './dashboard/MonthlyStats';

export default () => (
  <AuthUser>
    {({ data, error, loading }) => {
      if (error) {
        return <div>{error.message}</div>;
      }

      if (!loading) {
        return (
          <>
            <MonthlyStats />
            <Summary user={data.data} />
          </>
        );
      }

      return <div>Loading...</div>;
    }}
  </AuthUser>
);
