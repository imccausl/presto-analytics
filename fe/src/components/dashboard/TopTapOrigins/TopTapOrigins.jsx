import moment from 'moment';
import React from 'react';
import {
  ResponsiveContainer, PieChart, Pie, Tooltip, Cell, Legend,
} from 'recharts';
import PropTypes from 'prop-types';
import { Header, Divider } from 'semantic-ui-react';

const propTypes = {};
const defaultProps = {};
const COLORS = [
  '#3F69AA',
  '#006E6D',
  '#E8B5CE',
  '#FFD662',
  '#8D9440',
  '#C62168',
  '#6B5B95',
  '#FE840E',
  '#BFD641',
  '#6F9FD8',
];

function orderLocationByMostTaps(dataset) {
  const result = {};

  dataset.forEach(item => {
    if (item.location === '0') return;

    if (result[item.location]) {
      const prevLastVisited = Date.parse(result[item.location].lastVisited);
      const currLastVisited = item.date;

      result[item.location].count += 1;
      result[item.location].amount += item.amount;
      result[item.location].transfers += item.type === 'Transfer' ? 1 : 0;
      result[item.location].fares
        += item.type === 'Fare Payment' || item.type === 'Transit Pass Payment' ? 1 : 0;

      if (Date.parse(item.date) > prevLastVisited) {
        result[item.location].lastVisited = currLastVisited;
      }
    } else {
      result[item.location] = {
        count: 1,
        amount: item.amount,
        lastVisited: item.date,
        transfers: item.type === 'Transfer' ? 1 : 0,
        fares: item.type === 'Fare Payment' || item.type === 'Transit Pass Payment' ? 1 : 0,
      };
    }
  });

  const resultArray = Object.keys(result)
    .map(key => ({
      location: key,
      percent: Math.round((result[key].count / dataset.length) * 100),
      ...result[key],
    }))
    .filter(item => item.count > 1);

  const truncatedResults = resultArray.sort((a, b) => (a.count > b.count ? -1 : 1)).slice(0, 10);

  return truncatedResults;
}

const TopTapOrigins = props => {
  const { data, error, loading } = props;
  let dataset = [];
  let range = '';

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!loading && !error) {
    dataset = orderLocationByMostTaps(data.data.transactions);
    range = data.data.transactions.length === 0
      ? 'No Transactions For This Period'
      : `${moment(data.data.transactions[0].date).format('MMMM DD YYYY')} - ${moment(
        data.data.transactions[data.data.transactions.length - 1].date,
      ).format('MMMM DD YYYY')}`;
    console.log(dataset);
  }

  return (
    <>
      <Divider horizontal>
        <Header as="h3">
          Most Active Locations
          <Header.Subheader>{range}</Header.Subheader>
        </Header>
      </Divider>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie data={dataset} fill="#8884d8" dataKey="count">
            {dataset.map((entry, index) => (
              <Cell key={`cell-${entry.id}`} fill={COLORS[index]} />
            ))}
          </Pie>
          <Legend
            iconType="circle"
            verticalAlign="bottom"
            payload={dataset.map((item, index) => ({
              value: item.location,
              type: 'circle',
              id: item.id,
              color: COLORS[index],
            }))}
          />
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </>
  );
};

TopTapOrigins.propTypes = propTypes;
TopTapOrigins.defaultProps = defaultProps;

export default TopTapOrigins;
