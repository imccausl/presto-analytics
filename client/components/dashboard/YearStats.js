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
import { totalDailyTransactionBreakdown } from '../../util/transactions';

export default (props) => {
  const { data } = props;

  function getMonthNumFromName(name) {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    return months.indexOf(name) + 1;
  }

  function getDataset(obj) {
    const dataset = {
      data: [],
      totalAmount: 0,
      totalTaps: 0,
      costPerTap: 0,
    };
    const years = Object.keys(obj);

    years.forEach((year) => {
      const months = Object.keys(obj[year]);
      console.log(obj[year]);
      months.forEach((month) => {
        const { amount, transactions, transitPassAmount } = obj[year][month];
        const monthYearString = `${getMonthNumFromName(month)}/${year}`;

        dataset.totalAmount += amount + transitPassAmount;
        dataset.totalTaps += transactions.length;

        dataset.data.push({
          date: monthYearString,
          amount: amount + transitPassAmount,
          trips: transactions.length,
        });
      });
    });

    console.log(dataset.totalAmount, dataset.totalTaps, dataset.totalAmount / dataset.totalTaps);
    dataset.costPerTap = Math.round(100 * (dataset.totalAmount / dataset.totalTaps)) / 100;

    return dataset;
  }

  const dataset = getDataset(data);
  console.log(dataset);

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
          {`$${dataset.costPerTap} / Tap`}
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
            domain={dataset}
            tickMargin={20}
            dataKey="amount"
            tickLine={false}
            axisLine={false}
            stroke="#C4C4C4"
          />
          <XAxis dataKey="date" tickMargin={5} tickLine={false} axisLine={false} stroke="#C4C4C4" />

          <ReferenceLine y={146.25} label="Transit Pass Cost" stroke="red" />
          <Tooltip />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
