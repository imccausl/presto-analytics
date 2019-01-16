import { Segment } from 'semantic-ui-react';
import {
  ResponsiveContainer,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  Legend,
  Tooltip,
} from 'recharts';

import { totalDailyTransactionBreakdown } from '../../util/transactions';

export default (props) => {
  const { transactions } = props;
  const breakdown = totalDailyTransactionBreakdown(transactions, true);

  return (
    <ResponsiveContainer height={200}>
      <LineChart
        margin={{
          top: 20,
          right: 30,
          left: 0,
          bottom: 0,
        }}
        data={breakdown.dataset}
      >
        <CartesianGrid stroke="#EBEBEB" vertical={false} />

        <Line
          dataKey="trips"
          type="monotone"
          stroke="#3333cc"
          strokeWidth={5}
          dot={{
            stroke: 'white',
            strokeWidth: 3,
            fill: '#3333cc',
            r: 7,
          }}
        />
        <Line
          dataKey="amount"
          type="monotone"
          stroke="#333399"
          strokeWidth={5}
          dot={{
            stroke: 'white',
            strokeWidth: 3,
            fill: '#333399',
            r: 7,
          }}
        />
        <YAxis
          allowDecimals={false}
          type="number"
          domain={breakdown.domain}
          tickMargin={20}
          dataKey="amount"
          tickLine={false}
          axisLine={false}
          stroke="#C4C4C4"
        />
        <XAxis dataKey="date" tickMargin={15} tickLine={false} axisLine={false} stroke="#C4C4C4" />
        <Tooltip />
        <Legend />
      </LineChart>
    </ResponsiveContainer>
  );
};
