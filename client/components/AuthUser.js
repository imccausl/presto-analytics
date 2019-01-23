import Fetch from 'react-fetch-component';
import PropTypes from 'prop-types';

import API from '../lib/api';

const AuthUser = props => (
  <Fetch url={`${API.root}${API.currentUser.endpoint}`} options={API.send(API.currentUser.method)}>
    {payload => props.children(payload)}
  </Fetch>
);

AuthUser.propTypes = {
  children: PropTypes.func.isRequired,
};

export default AuthUser;
