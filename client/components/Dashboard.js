import { FlexRow } from './Page';

import MonthlyOverview from './dashboard/MonthlyOverview';
import YearOverview from './dashboard/YearOverview';

const Dashboard = (props) => {
  const { budget } = props.props;
  console.log('Dasboard: ', props.props);

  return (
    <div>
      <MonthlyOverview budget={budget || {}} />
      <YearOverview budget={budget || {}} />
    </div>
  );
};

export default Dashboard;
