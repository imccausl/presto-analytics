const jsdom = require('jsdom');
const parse = require('csv-parse');
const API = require('./api_endpoints');
const { getCSRF } = require('./auth');

const { JSDOM } = jsdom;

async function getBasicAccountInfo(requestInstance) {
  const accountResponse = await requestInstance({ uri: API.dashboard });
  const { window } = new JSDOM(accountResponse.body);

  const balance = window.document.querySelector('.dashboard__quantity').textContent;
  const cardNumber = window.document.querySelector('#cardNumber').textContent;

  return { balance, cardNumber };
}

function parseCSV(data) {
  return parse(data, { columns: true }, (err, output) => {
    if (err) {
      return { error: err };
    }

    return output;
  });
}

async function getUsageReport(requestInstance, year) {
  try {
    const token = await getCSRF(requestInstance, API.usageReport, 'TransitUsageReport');
    const searchYear = (typeof year === 'number' ? year.toString() : year) || new Date().getFullYear().toString();
    const PAGE_SIZE = 1000;

    return await requestInstance(
      {
        uri: API.usageEndpoint,
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
      (error, response) => {
        if (error) {
          return { error };
        }

        const csv = parseCSV(response.body);

        return csv;
      }
    );
  } catch (error) {
    return { error };
  }
}

module.exports = {
  getCSV,
  getUsageReport,
  getBasicAccountInfo
};
