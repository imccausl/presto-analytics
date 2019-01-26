import Fetch from 'react-fetch-component';
import PropTypes from 'prop-types';
import { Loader, Dimmer } from 'semantic-ui-react';

import API from '../lib/api';

const AuthUser = props => (
  <Fetch url={`${API.root}${API.currentUser.endpoint}`} options={API.send(API.currentUser.method)}>
    {(payload) => {
      if (payload.loading) {
        return (
          <Dimmer active>
            <Loader />
          </Dimmer>
        );
      }

      return props.children(payload);
    }}
  </Fetch>
);

AuthUser.propTypes = {
  children: PropTypes.func.isRequired,
};

export default AuthUser;
