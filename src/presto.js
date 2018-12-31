require('dotenv').config({ path: '../.env' });

const { promisify } = require('util');
const req = require('request');
const jsdom = require('jsdom');

const cookieJar = new jsdom.CookieJar();
const { JSDOM } = jsdom;

const LOGIN_ENDPOINT = 'https://www.prestocard.ca/api/sitecore/AFMSAuthentication/SignInWithAccount';
const SITE_START = 'https://www.prestocard.ca/en/';
const ACTIVITY_START = 'https://www.prestocard.ca/en/dashboard/transit-usage-report';
const ACTIVITY_ENDPOINT = 'https://www.prestocard.ca/api/sitecore/Paginator/TransitUsageReportFilteredIndex';
const ACTIVITY_CSV = 'https://www.prestocard.ca/api/sitecore/Paginator/TransitUsageExportCSV';

const jar = req.jar();
const request = promisify(req.defaults({ jar, proxy: 'http://127.0.0.1:8080' }));

// Get the CSRF Token
async function getCSRF(endpoint, parentId) {
  const parentIdInput = parentId || 'signwithaccount';
  const searchEndpoint = endpoint || SITE_START;

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
  request('https://www.prestocard.ca/dashboard', (error, response, body) => {
    const { window } = new JSDOM(body);

    const balance = window.document.querySelector('.dashboard__quantity').textContent;
    const cardNumber = window.document.querySelector('#cardNumber').textContent;

    console.log(`Card Number: ${cardNumber} Current Balance: ${balance}`);
  });
}

async function getUsageReport(year) {
  const token = await getCSRF(ACTIVITY_START, 'TransitUsageReport');
  const searchYear = (typeof year === 'number' ? year.toString() : year) || new Date().getFullYear().toString();
  const PAGE_SIZE = 1000;

  request(
    ACTIVITY_ENDPOINT,
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

      request.get(ACTIVITY_CSV, (error, response, body) => {
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
    LOGIN_ENDPOINT,
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
      console.log(response.statusCode);

      getBasicAccountInfo();
      getUsageReport();
    }
  );
}

login(process.env.TEST_USERNAME, process.env.TEST_PASSWORD);
