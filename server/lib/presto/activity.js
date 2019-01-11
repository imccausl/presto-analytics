const jsdom = require('jsdom');
const moment = require('moment');

const paginationModel = require('./data/paginationModel.json');
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

function parseActivity(serverResponse) {
  const dom = new JSDOM(serverResponse.body);
  const data = dom.window.document.querySelectorAll('table#tblTHR tbody tr');
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
      serviceClass: items[4],
      discount: items[5].replace(/[($)]/g, ''),
      amount: items[6].replace(/[($)]/g, ''),
      balance: items[7].replace(/[($)]/g, '')
    });
  });

  return transactions;
}

function getActivityRequestBody(selectedMonth) {
  const PAGE_SIZE = 2000;

  return {
    TransactionType: '0',
    Agency: '-1',
    PageSize: `${PAGE_SIZE}`,
    selectedMonth,
    currentModel: paginationModel
  };
}

// THIS DOESN'T TOTALLY WORK AS I'D LIKE BUT ITS NOT IMPORTANT RIGHT NOW
// SO I'LL REVISIT IT LATER:
//
// function getSelectedMonthValue(year, month, currentMonthDate = moment()) {
//   const requestedMonthDate = moment([year, month]);
//   const monthDiff = currentMonthDate.diff(requestedMonthDate, 'months');
//   const monthDiffPlusPrestoWeirdValue = monthDiff + 2;
//   return monthDiffPlusPrestoWeirdValue.toString();
// }

// async function getActivityByMonth(requestInstance, year, month) {
//   try {
//     const token = await getCSRF(requestInstance, API.cardActivity, 'CardActivity');
//     const selectedMonth = getSelectedMonthValue(year, month);
//     console.log(selectedMonth);
//     const resp = await requestInstance({
//       uri: API.activityEndpoint,
//       method: 'POST',
//       json: getActivityRequestBody(selectedMonth),
//       headers: {
//         __RequestVerificationToken: token,
//         'Accept-Language': 'en-US,en;q=0.5',
//         'Content-Type': 'application/json; charset=utf-8',
//         Referrer: 'https://www.prestocard.ca/en/dashboard/card-activity',
//         'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:64.0) Gecko/20100101 Firefox/64.0',
//         'X-Requested-With': 'XMLHttpRequest',
//         Accept: '*/*',
//         Connection: 'keep-alive'
//       }
//     });

//     return parseActivity(resp);
//   } catch (error) {
//     return { error };
//   }
// }

async function getActivityByDateRange(requestInstance, from, to = moment()) {
  try {
    const fromFormatted = moment(from, 'MM/DD/YYYY').format('MM/DD/YYYY');
    const toFormatted = moment(to, 'MM/DD/YYYY').format('MM/DD/YYYY');
    const dateRange = `${fromFormatted} - ${toFormatted}`;
    const resp = await requestInstance({
      uri: API.activityEndpoint,
      method: 'POST',
      json: getActivityRequestBody(dateRange),
      withCredentials: true
      // headers: {
      //   // __RequestVerificationToken: token,
      //   'Accept-Language': 'en-US,en;q=0.5',
      //   'Content-Type': 'application/json; charset=utf-8',
      //   Referrer: 'https://www.prestocard.ca/en/dashboard/card-activity',
      //   'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:64.0) Gecko/20100101 Firefox/64.0',
      //   'X-Requested-With': 'XMLHttpRequest',
      //   Accept: '*/*',
      //   Connection: 'keep-alive'
      // }
    });

    return parseActivity(resp);
  } catch (error) {
    return { error };
  }
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
        Referrer: 'https://www.prestocard.ca/en/dashboard/card-activity',
        'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:64.0) Gecko/20100101 Firefox/64.0',
        'X-Requested-With': 'XMLHttpRequest',
        Accept: '*/*',
        Connection: 'keep-alive'
      }
    });

    // return parseUsageReport(resp); selector: #tblTUR
  } catch (error) {
    return { error };
  }
}

module.exports = {
  getUsageReport,
  getBasicAccountInfo,
  getActivityByDateRange
};
