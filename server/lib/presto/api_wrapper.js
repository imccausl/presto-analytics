const { login, isLoggedIn } = require('./auth');
const { getBasicAccountInfo, getUsageReport, getActivityByMonth, getActivityByDateRange } = require('./activity');

module.exports = requestInstance => ({
  // auth.js functions
  login: (username, password) => login(requestInstance, username, password),
  isLoggedIn: () => isLoggedIn(requestInstance),

  // activity.js functions
  getBasicAccountInfo: () => getBasicAccountInfo(requestInstance),
  getUsageReport: year => getUsageReport(requestInstance, year),
  // getActivityByMonth: (year, month) => getActivityByMonth(requestInstance, year, month),
  getActivityByDateRange: (from, to, cardNumber) => getActivityByDateRange(requestInstance, from, to, cardNumber)
});
