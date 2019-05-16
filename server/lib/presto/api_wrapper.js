const { login, isLoggedIn, createCookieJar } = require('./auth');
const {
  getBasicAccountInfo,
  getUsageReport,
  getActivityByMonth,
  setCookieJar,
  getActivityByDateRange
} = require('./activity');

module.exports = requestWrapper => ({
  // auth.js functions
  login(username, password) {
    return login.call(this, requestWrapper, username, password);
  },
  isLoggedIn() {
    return isLoggedIn.call(this, requestWrapper);
  },
  createCookieJar() {
    return createCookieJar.call(this, requestWrapper);
  },
  setCookieJar(cookies) {
    return setCookieJar.call(this, requestWrapper, cookies);
  },

  // activity.js functions
  getBasicAccountInfo() {
    return getBasicAccountInfo.call(this, requestWrapper);
  },
  getUsageReport(year, jar) {
    return getUsageReport.call(this, requestWrapper, year, jar);
  },
  // getActivityByMonth: (year, month) => getActivityByMonth(requestWrapper, year, month),
  getActivityByDateRange(from, to, cardNumber) {
    return getActivityByDateRange.call(this, requestWrapper, from, to, cardNumber);
  }
});
