require('dotenv').config({ path: '../../.env' });

const { promisify } = require('util');
const req = require('request');
const apiRequestWrapper = require('./api_wrapper');
const API = require('./api_endpoints');

const jar = req.jar();
let proxy = false;

if (process.env.NODE_ENV === 'Dev') {
  proxy = 'http://127.0.0.1:8080';
}
const options = { jar, baseUrl: API.baseUrl, proxy };
const request = promisify(req.defaults(options));

module.exports = apiRequestWrapper(request);
