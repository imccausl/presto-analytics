import sendRequest from './sendRequest';
import { logout, deleteAccount } from './user';
import { prestoLogin, prestoIsLoggedIn } from './presto';
import { updateBudget } from './budget';
import me from './me';

const apiHandlerWrapper = requestHandler => ({
  logout: () => logout(requestHandler),
  deleteAccount: () => deleteAccount(requestHandler),
  prestoLogin: (username, password) => prestoLogin(requestHandler, username, password),
  prestoIsLoggedIn: () => prestoIsLoggedIn(requestHandler),
  updateBudget: body => updateBudget(requestHandler, body),
  me: () => me(requestHandler),
});

export default apiHandlerWrapper(sendRequest);
