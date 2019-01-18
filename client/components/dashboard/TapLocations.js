import {
  VictoryBar, VictoryChart, VictoryTheme, VictoryPie, VictoryAxis,
} from 'victory';

export default (props) => {
  const { transactions } = props;

  function makeDataset(data) {
    const sortedData = {};

    console.log(data);

    data.forEach((item) => {
      if (!sortedData[item.location]) {
        sortedData[item.location] = 1;
        return;
      }

      sortedData[item.location] += 1;
    });

    return {
      data: Object.keys(sortedData).map(key => ({ x: key, y: sortedData[key] })),
      labels: Object.keys(sortedData).map(key => key),
      values: Object.keys(sortedData).map((key, index) => index + 1),
    };
  }

  const dataset = makeDataset(transactions);
  console.log(dataset);

  return (
    <div style={{ width: '300px', margin: '0 auto' }}>
      <VictoryPie theme={VictoryTheme.material} animate={{ duration: 2000 }} data={dataset.data} />
    </div>
  );
};
