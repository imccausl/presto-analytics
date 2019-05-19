const { login, checkLogin, createCookieJar } = require('./auth');
const {
  getBasicAccountInfo,
  getUsageReport,
  setCookieJar,
  getActivityByDateRange
} = require('./activity');

module.exports = requestWrapper => ({
  // auth.js functions
  login(username, password) {
    return login.call(this, requestWrapper, username, password);
  },
  createCookieJar() {
    return createCookieJar.call(this, requestWrapper);
  },
  setCookieJar(cookies) {
    return setCookieJar.call(this, requestWrapper, cookies);
  },
  checkLogin() {
    return checkLogin.call(this, requestWrapper);
  },

  // activity.js functions
  getBasicAccountInfo() {
    return getBasicAccountInfo.call(this, requestWrapper);
  },
  getUsageReport(year, jar) {
    return getUsageReport.call(this, requestWrapper, year, jar);
  },
  getActivityByDateRange(cardNumber, from, to) {
    return getActivityByDateRange.call(this, requestWrapper, cardNumber, from, to);
  }
});
