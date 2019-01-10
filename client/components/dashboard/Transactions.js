import Fetch from 'react-fetch-component';
import API from '../../util/api';

export default (props) => {
  const { month, year } = props;

  return (
    <Fetch url={`${API.root}${API.prestoUsage(month)}`} options={API.send('GET')}>
      {({ data, error, loading }) => {
        console.log(data);
      }}
    </Fetch>
  );
};
