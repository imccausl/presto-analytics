require('dotenv').config({ path: '../.env' });

const { promisify } = require('util');
const req = require('request');
const jsdom = require('jsdom');
const API = require('./api_endpoints');

const cookieJar = new jsdom.CookieJar();
const { JSDOM } = jsdom;

const jar = req.jar();
const request = promisify(req.defaults({ jar, proxy: 'http://127.0.0.1:8080' }));

// Get the CSRF Token
async function getCSRF(endpoint, parentId) {
  const parentIdInput = parentId || 'signwithaccount';
  const searchEndpoint = endpoint || `${API.baseUrl}${API.homepage}`;

  try {
    const { body } = await request(searchEndpoint);
    const dom = new JSDOM(body, { cookieJar });
    const token = dom.window.document.querySelector(`#${parentIdInput} input[name='__RequestVerificationToken']`).value;

    return await token;
  } catch (error) {
    console.log('ERROR:', error);
  }
}

async function getBasicAccountInfo() {
  request(`${API.baseUrl}${API.dashboard}`, (error, response, body) => {
    const { window } = new JSDOM(body);

    const balance = window.document.querySelector('.dashboard__quantity').textContent;
    const cardNumber = window.document.querySelector('#cardNumber').textContent;

    console.log(`Card Number: ${cardNumber} Current Balance: ${balance}`);
  });
}

async function getUsageReport(year) {
  const token = await getCSRF(`${API.baseUrl}${API.usageReport}`, 'TransitUsageReport');
  const searchYear = (typeof year === 'number' ? year.toString() : year) || new Date().getFullYear().toString();
  const PAGE_SIZE = 1000;

  request(
    `${API.baseUrl}${API.usageEndpoint}`,
    {
      method: 'POST',
      json: {
        PageSize: PAGE_SIZE.toString(),
        TransactionCateogryID: '1',
        Year: searchYear,
        currentModel: ''
      },
      headers: {
        __RequestVerificationToken: token,
        'Accept-Language': 'en-US,en;q=0.5',
        'Content-Type': 'application/json; charset=utf-8',
        Referrer: 'https://www.prestocard.ca/en/dashboard/transit-usage-report',
        'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:64.0) Gecko/20100101 Firefox/64.0',
        'X-Requested-With': 'XMLHttpRequest',
        Accept: '*/*',
        Connection: 'keep-alive'
      }
    },
    (error, response, body) => {
      console.log(response.statusCode, `[3] Getting CSV of data for ${searchYear}...`);

      request.get(`${API.baseUrl}${API.csvEndpoint}`, (error, response, body) => {
        console.log(body);
      });
    }
  );
}

async function login(username, password) {
  const token = await getCSRF();

  console.log('[1] Logging in...');
  console.log(token);
  request(
    `${API.baseUrl}${API.loginEndpoint}`,
    {
      method: 'POST',
      json: {
        anonymousOrderACard: false,
        custSecurity: {
          Login: username,
          Password: password,
          __RequestVerificationToken: token
        }
      },
      headers: {
        __RequestVerificationToken: token,
        'Accept-Language': 'en-US,en;q=0.5',
        'Content-Type': 'application/json; charset=utf-8',
        Referrer: 'https://www.prestocard.ca/home',
        'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:64.0) Gecko/20100101 Firefox/64.0',
        'X-Requested-With': 'XMLHttpRequest',
        Accept: '*/*',
        Connection: 'keep-alive'
      }
    },
    (error, response, body) => {
      if (!error) {
        console.log(response.statusCode);

        getBasicAccountInfo();
        getUsageReport();
      } else {
        console.error(`ERROR: ${error}`);
      }
    }
  );
}

login(process.env.TEST_USERNAME, process.env.TEST_PASSWORD);
