import Fetch from 'react-fetch-component';
import {
  Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts';

import API from '../../util/api';

export default (props) => {
  const { month, year } = props;

  return (
    <Fetch url={`${API.root}${API.monthlyTransactions(year, month)}`} options={API.send('GET')}>
      {({ data, error, loading }) => {
        console.log(data);
        if (!loading && !error) {
          const byDate = {};

          data.data.transactions.forEach((item) => {
            const date = new Date(item.date).toDateString();
            const amount = parseFloat(item.amount);

            if (!byDate[date]) {
              byDate[date] = { amount, trips: 1 };
            } else {
              byDate[date].amount += amount;
              byDate[date].trips += 1;
            }
          });

          const transactions = Object.keys(byDate).map((key) => {
            const days = ['S', 'M', 'T', 'W', 'TH', 'F', 'SA'];
            const currDate = new Date(key);

            return {
              date: currDate.getDate(),
              amount: byDate[key].amount,
              trips: byDate[key].trips,
            };
          });
          console.log(transactions);

          return (
            <>
              <div>
Total: $
                {data.data.totalAmount || data.data.totalTrips * 3}
              </div>
              <div>
                Trips:
                {data.data.totalTrips}
              </div>
              <LineChart width={800} height={200} data={transactions}>
                <Line type="monotone" dataKey="trips" stroke="#8884d8" />
                <Line type="monotone" dataKey="amount" stroke="#ff5500" />
                <CartesianGrid stroke="#f5f5f5" />
                <YAxis dataKey="amount" />
                <XAxis dataKey="date" scaleToFit />
                <Tooltip />
              </LineChart>
            </>
          );
        }
      }}
    </Fetch>
  );
};
