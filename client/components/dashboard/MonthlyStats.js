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

import { FlexRow } from '../Page';

import { totalDailyTransactionBreakdown } from '../../lib/transactions';

export default (props) => {
  const { data, month, year } = props;

  const { transactions, totalAmount } = data;

  const breakdown = totalDailyTransactionBreakdown(transactions, true);

  return (
    <div>
      <FlexRow justify="space-between" align="center">
        <h3
          style={{
            marginTop: '0',
            marginBottom: '0',
            marginLeft: '25px',
            color: '#11BB81',
          }}
        >
          {`${month} ${year}`}
        </h3>
        <h3 style={{ marginTop: '0', marginRight: '30px', color: '#3BB4E9' }}>
          {`$${totalAmount} Total`}
        </h3>
      </FlexRow>
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
            stroke="#3BB4E9"
            strokeWidth={5}
            dot={{
              stroke: 'white',
              strokeWidth: 3,
              fill: '#3BB4E9',
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
          <XAxis
            dataKey="date"
            tickMargin={15}
            tickLine={false}
            axisLine={false}
            stroke="#C4C4C4"
          />
          <Tooltip />
          <Legend />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
