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

import { totalDailyTransactionBreakdown } from '../../lib/transactions';

export default (props) => {
  const {
    data: { transactions },
  } = props;
  const breakdown = totalDailyTransactionBreakdown(transactions);

  return (
    <ResponsiveContainer width="60%" height={100}>
      <LineChart
        margin={{
          top: 20,
          right: 30,
          left: 0,
          bottom: 0,
        }}
        data={breakdown.dataset}
      >
        <Line
          dataKey="trips"
          type="monotone"
          stroke="#3333cc"
          strokeWidth={2}
          dot={{
            stroke: 'white',
            strokeWidth: 3,
            fill: '#3333cc',
            r: 3,
          }}
        />
        <XAxis dataKey="date" tickLine={false} axisLine={false} stroke="#444444" />
      </LineChart>
    </ResponsiveContainer>
  );
};
