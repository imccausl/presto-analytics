import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar } from "recharts";

function getDataset(data) {
  return {
    year: {
      taps: 0,
      amount: 0
    }
  };
}

export default props => {
  const { data } = props;
  const dataset = getDataset(data);

  return (
    <BarChart width={400} height={250} data={dataset}>
      <CartesianGrid />
      <XAxis dataKey="year" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="taps" />
      <Bar dataKey="amount" />
    </BarChart>
  );
};
