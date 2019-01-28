import sendRequest from './sendRequest';
import { logout } from './user';
import { prestoLogin, prestoIsLoggedIn } from './presto';
import { updateBudget } from './budget';

const apiHandlerWrapper = requestHandler => ({
  logout: () => logout(requestHandler),
  prestoLogin: (username, password) => prestoLogin(requestHandler, username, password),
  prestoIsLoggedIn: () => prestoIsLoggedIn(requestHandler),
  updateBudget: body => updateBudget(requestHandler, body),
});

export default apiHandlerWrapper(sendRequest);
