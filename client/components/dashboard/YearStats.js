import moment from 'moment';
import {
  ResponsiveContainer,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  ReferenceLine,
  Tooltip,
} from 'recharts';

import { FlexRow } from '../Page';

export default (props) => {
  console.log(props);
  const {
    dataset,
    budget: { fareCost, monthlyPassCost },
  } = props;

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
          {'Year to Month'}
        </h3>
        <h3 style={{ marginTop: '0', marginRight: '30px', color: '#3BB4E9' }}>
          {`$${dataset.totalAmount} Total`}
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
          data={dataset.data}
        >
          <CartesianGrid stroke="#EBEBEB" vertical={false} />

          <Line
            dataKey="paymentTaps"
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
            dataKey="transferTaps"
            type="monotone"
            stroke="#11BB81"
            strokeWidth={5}
            dot={{
              stroke: 'white',
              strokeWidth: 3,
              fill: '#11BB81',
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
            type="number"
            tickMargin={20}
            dataKey="amount"
            tickLine={false}
            axisLine={false}
            stroke="#C4C4C4"
          />
          <XAxis dataKey="date" tickMargin={5} tickLine={false} axisLine={false} stroke="#C4C4C4" />

          <ReferenceLine y={parseFloat(monthlyPassCost)} label="Transit Pass Cost" stroke="red" />
          <ReferenceLine
            y={parseFloat(monthlyPassCost) / parseFloat(fareCost)}
            label="Transit Pass Break-even"
            stroke="red"
          />

          <Tooltip />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
