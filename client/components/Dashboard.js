import { FlexRow } from './Page';

import MonthlyOverview from './dashboard/MonthlyOverview';
import YearOverview from './dashboard/YearOverview';

export default () => (
  <div>
    <MonthlyOverview />
    <YearOverview />
  </div>
);
