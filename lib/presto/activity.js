const jsdom = require('jsdom');
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

function parseActivities(serverResponse) {
  const dom = new JSDOM(serverResponse.body);
  const data = dom.window.document.querySelectorAll('#paginator-content table#tblTUR tbody tr');
  const transactions = [];

  data.forEach(node => {
    const transactionInfo = node.querySelectorAll('td');
    const items = [];

    transactionInfo.forEach(item => {
      items.push(item.textContent.trim());
    });

    transactions.push({
      date: items[0],
      agency: items[1],
      location: items[2],
      type: items[3],
      amount: items[4]
    });
  });

  return transactions;
}

async function getUsageReport(requestInstance, year) {
  try {
    const token = await getCSRF(requestInstance, API.usageReport, 'TransitUsageReport');
    const searchYear = (typeof year === 'number' ? year.toString() : year) || new Date().getFullYear().toString();
    const PAGE_SIZE = 1000;
    const TransactionCategory = {
      ALL: '0',
      TRIPS: '1',
      TRANSIT_PASS: '2'
    };

    const resp = await requestInstance({
      uri: API.usageEndpoint,
      method: 'POST',
      json: {
        PageSize: PAGE_SIZE.toString(),
        TransactionCateogryID: TransactionCategory.TRIPS,
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

    return parseActivities(resp);
  } catch (error) {
    return { error };
  }
}

module.exports = {
  getUsageReport,
  getBasicAccountInfo
};
