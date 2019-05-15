const { login, isLoggedIn, createCookieJar } = require('./auth');
const {
  getBasicAccountInfo,
  getUsageReport,
  getActivityByMonth,
  getActivityByDateRange
} = require('./activity');

module.exports = requestInstance => ({
  // auth.js functions
  login: (username, password, jar) => login(requestInstance, username, password, jar),
  isLoggedIn: jar => isLoggedIn(requestInstance, jar),
  createCookieJar: () => createCookieJar(requestInstance),

  // activity.js functions
  getBasicAccountInfo: jar => getBasicAccountInfo(requestInstance, jar),
  getUsageReport: (year, jar) => getUsageReport(requestInstance, year, jar),
  // getActivityByMonth: (year, month) => getActivityByMonth(requestInstance, year, month),
  getActivityByDateRange: (from, to, cardNumber, jar) =>
    getActivityByDateRange(requestInstance, from, to, cardNumber, jar)
});
