import { FlexRow } from './Page';

import MonthlyOverview from './dashboard/MonthlyOverview';
import YearOverview from './dashboard/YearOverview';
import Transactions from './dashboard/Transactions';

const Dashboard = (props) => {
  console.log(props);

  return (
    <div>
      <MonthlyOverview />
      <YearOverview />
    </div>
  );
};

export default Dashboard;
