import AuthUser from './AuthUser';
import Summary from './dashboard/Summary';
import MonthlyStats from './dashboard/MonthlyStats';
import Transactions from './dashboard/Transactions';

export default () => (
  <AuthUser>
    {({ data, error, loading }) => {
      if (error) {
        return <div>{error.message}</div>;
      }

      if (!loading) {
        return (
          <>
            <MonthlyStats month="11" year="2018" />
            <Summary user={data.data} />
          </>
        );
      }

      return <div>Loading...</div>;
    }}
  </AuthUser>
);
