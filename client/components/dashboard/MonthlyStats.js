import Fetch from 'react-fetch-component';
import {
  Line, LineChart, XAxis, YAxis,
} from 'recharts';

import API from '../../util/api';

export default (props) => {
  const { month, year } = props;

  return (
    <Fetch url={`${API.root}${API.monthlyTransactions('2018', '12')}`} options={API.send('GET')}>
      {({ data, error, loading }) => {
        console.log(data);
        if (!loading && !error) {
          const byDate = {};

          data.data.transactions.forEach((item) => {
            const date = new Date(item.date).toDateString();
            const amount = parseFloat(item.amount);

            if (!byDate[date]) {
              byDate[date] = amount;
            } else {
              byDate[date] += amount;
            }
          });

          const transactions = Object.keys(byDate).map((key) => {
            // const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
            const currDate = new Date(key);

            return {
              date: currDate.getDate(),
              amount: byDate[key],
            };
          });
          console.log(transactions);

          return (
            <LineChart width={1000} height={300} data={transactions}>
              <Line type="monotone" dataKey="amount" stroke="#8884d8" />
              <XAxis dataKey="date" />
              <YAxis />
            </LineChart>
          );
        }
      }}
    </Fetch>
  );
};
