import Fetch from 'react-fetch-component';
import API from '../../util/api';

export default props => (
  <Fetch url={`${API.root}${API.prestoUsage}`} options={API.send({ from: '01/01/2018' })}>
    {({ data, error, loading }) => {
      console.log(data);
    }}
  </Fetch>
);
