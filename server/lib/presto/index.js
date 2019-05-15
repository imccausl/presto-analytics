require('dotenv').config({ path: '../../.env' });

const { promisify } = require('util');
const req = require('request');
const apiRequestWrapper = require('./api_wrapper');
const API = require('./api_endpoints');

const jar = req.jar();

const options = { baseUrl: API.baseUrl };
const request = promisify(req.defaults(options));

module.exports = apiRequestWrapper(request);
