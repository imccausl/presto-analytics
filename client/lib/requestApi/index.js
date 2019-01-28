import sendRequest from './sendRequest';
import { logout } from './user';
import { prestoLogin } from './presto';
import { updateBudget } from './budget';

const apiHandlerWrapper = requestHandler => ({
  logout: () => logout(requestHandler),
  prestoLogin: (username, password) => prestoLogin(requestHandler, username, password),
  updateBudget: body => updateBudget(requestHandler, body),
});

export default apiHandlerWrapper(sendRequest);
