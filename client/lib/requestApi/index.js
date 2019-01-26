import sendRequest from './sendRequest';
import { logout } from './user';
import { prestoLogin } from './presto';

const apiHandlerWrapper = requestHandler => ({
  logout: () => logout(requestHandler),
  prestoLogin: (username, password) => prestoLogin(requestHandler, username, password),
});

export default apiHandlerWrapper(sendRequest);
