import moment from 'moment';
import { Segment } from 'semantic-ui-react';
import Fetch from 'react-fetch-component';
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
import API from '../../util/api';

export default (props) => {
  const { transactions } = props;

  const byDate = {};
  const domain = [0, 0];
  const currYear = new Date(transactions[0].date).getFullYear();
  const currMonth = new Date(transactions[0].date).getMonth() + 1;
  const lastDay = new Date(transactions[0].date).getDate();

  for (let i = 1; i <= lastDay; i += 1) {
    const dateString = `${i < 10 ? `0${i}` : i}/${
      currMonth < 10 ? `0${currMonth}` : currMonth
    }/${currYear}`;

    byDate[dateString] = { amount: 0, trips: 0 };
  }

  transactions.forEach((item) => {
    const date = new Date(item.date).toLocaleDateString();
    const amount = parseFloat(item.amount);

    byDate[date].amount += amount;
    byDate[date].trips += 1;
  });

  const breakdown = Object.keys(byDate).map((key) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const currDate = moment(key, 'DD/MM/YYYY');

    domain[1] = domain[1] < byDate[key].trips ? byDate[key].trips : domain[1];
    domain[1] = domain[1] < byDate[key].amount ? byDate[key].amount : domain[1];
    return {
      date: currDate.format('D'),
      dayOfWeek: days[currDate.day()],
      amount: byDate[key].amount,
      trips: byDate[key].trips,
    };
  });
  console.log(domain);

  return (
    <ResponsiveContainer height={200}>
      <LineChart
        margin={{
          top: 20,
          right: 30,
          left: 0,
          bottom: 0,
        }}
        data={breakdown}
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
          domain={domain}
          tickMargin={20}
          dataKey="amount"
          tickLine={false}
          axisLine={false}
          stroke="#C4C4C4"
        />
        <XAxis dataKey="date" tickLine={false} axisLine={false} stroke="#C4C4C4" />
        <Tooltip />
        <Legend />
      </LineChart>
    </ResponsiveContainer>
  );
};
