const { login, isLoggedIn } = require('./auth');
const { getBasicAccountInfo, getUsageReport } = require('./activity');

module.exports = requestInstance => ({
  // auth.js functions
  login: (username, password) => login(requestInstance, username, password),
  isLoggedIn: () => isLoggedIn(requestInstance),

  // activity.js functions
  getBasicAccountInfo: () => getBasicAccountInfo(requestInstance),
  getUsageReport: year => getUsageReport(requestInstance, year)
});
