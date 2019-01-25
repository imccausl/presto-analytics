import sendRequest from './sendRequest';
import { logout } from './user';

const apiHandlerWrapper = requestHandler => ({
  logout: () => logout(requestHandler),
});

export default apiHandlerWrapper(sendRequest);
