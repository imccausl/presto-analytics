require('dotenv').config({ path: '../.env' });

const { promisify } = require('util');
const req = require('request');
const jsdom = require('jsdom');
const parse = require('csv-parse');
const API = require('./api_endpoints');
const { getCSRF } = require('./auth');
// const cookieJar = new jsdom.CookieJar();
const { JSDOM } = jsdom;

const jar = req.jar();
const request = promisify(req.defaults({ jar, proxy: 'http://127.0.0.1:8080' }));

async function getBasicAccountInfo() {
  const url = `${API.baseUrl}${API.dashboard}`;
  const accountResponse = await request(url);
  const { window } = new JSDOM(accountResponse.body);

  const balance = window.document.querySelector('.dashboard__quantity').textContent;
  const cardNumber = window.document.querySelector('#cardNumber').textContent;

  console.log(`Card Number: ${cardNumber} Current Balance: ${balance}`);

  return { balance, cardNumber };
}

async function getCSV(requestInstance) {
  try {
    const url = `${API.baseUrl}${API.csvEndpoint}`;
    const resp = await requestInstance.get(url);

    return parse(resp.body, { columns: true }, (err, output) => {
      if (err) {
        console.error(`Error: ${err}`);
        return { error: err };
      }

      return output;
    });
  } catch (error) {
    return { error };
  }
}

async function getUsageReport(requestInstance, year) {
  try {
    const token = await getCSRF(`${API.baseUrl}${API.usageReport}`, 'TransitUsageReport');
    const searchYear = (typeof year === 'number' ? year.toString() : year) || new Date().getFullYear().toString();
    const PAGE_SIZE = 1000;
    const url = `${API.baseUrl}${API.usageEndpoint}`;

    await requestInstance(url, {
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
    });

    return await getCSV(requestInstance);
  } catch (error) {
    return { error };
  }
}

module.exports = {
  getCSV,
  getUsageReport,
  getBasicAccountInfo
};
