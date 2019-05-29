import { Segment } from 'semantic-ui-react';

import MonthlyOverview from './dashboard/MonthlyOverview';
import YearOverview from './dashboard/YearOverview';

const Dashboard = props => {
  const { budget } = props.props;
  console.log('Dasboard: ', props.props);

  return (
    <>
      <MonthlyOverview budget={budget || {}} />
      <Segment vertical>
        <YearOverview budget={budget || {}} />
      </Segment>
    </>
  );
};

export default Dashboard;
