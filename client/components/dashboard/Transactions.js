import Fetch from 'react-fetch-component';
import { Dimmer, Loader } from 'semantic-ui-react';

import API from '../../lib/api';

export default props => (
  <Fetch url={`${API.root}${API.prestoUsage}`} options={API.send({ from: '01/01/2018' })}>
    {({ data, error, loading }) => {
      if (loading) {
        return (
          <Dimmer active>
            <Loader />
          </Dimmer>
        );
      }
    }}
  </Fetch>
);
