require('dotenv').config({ path: '../../.env' });

const { promisify } = require('util');
const req = require('request');
const apiRequestWrapper = require('./api_wrapper');
const API = require('./api_endpoints');

const options = { baseUrl: API.baseUrl };
const request = promisify(req.defaults(options));

function Presto(cookieJar) {
  this.cookieJar = cookieJar || apiRequestWrapper(request).createCookieJar();
}

Presto.prototype = {
  ...apiRequestWrapper.call(Presto, request),
  getCookieJar: () => this.cookieJar.getCookies(API.baseUrl)
};

console.log(Presto.prototype);
module.exports = Presto;
