import { FlexRow } from './Page';

import MonthlyOverview from './dashboard/MonthlyOverview';
import YearOverview from './dashboard/YearOverview';
import withAuth from '../lib/withAuth';

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
