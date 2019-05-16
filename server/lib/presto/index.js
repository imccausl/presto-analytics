require('dotenv').config({ path: '../../.env' });

const { promisify } = require('util');
const req = require('request');
const apiRequestWrapper = require('./api_wrapper');
const API = require('./api_endpoints');

const options = { baseUrl: API.baseUrl };
const request = promisify(req.defaults(options));

function Presto(cookies) {
  this.cookieJar = request.jar();
  this.setCookieJar(cookies);
}

Presto.prototype = {
  ...apiRequestWrapper(request),
  getCookies() {
    return this.cookieJar.getCookies(API.baseUrl);
  }
};

module.exports = Presto;
