const jsdom = require('jsdom');
const moment = require('moment');

const paginationModel = require('./data/paginationModel.json');
const API = require('./api_endpoints');
const { getCSRF } = require('./auth');

const { JSDOM } = jsdom;

function removeDuplicates(myArr, prop) {
  return myArr.filter((obj, pos, arr) => arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos);
}

function getCardsAndBalances(serverResponse) {
  const dom = new JSDOM(serverResponse.body);
  const scrapeCards = dom.window.document.querySelectorAll('a.fareMediaID');
  let cards = [];

  if (scrapeCards) {
    const data = [...scrapeCards]; // convert NodeList into Array
    const cardsAndBalances = data.map(item => ({ cardNumber: item.dataset.visibleid, balance: item.childNodes[2].textContent.trim() }));
    cards = removeDuplicates(cardsAndBalances, 'cardNumber');
  }

  cards.push({
    cardNumber: dom.window.document.getElementById('cardNumber').textContent,
    balance: dom.window.document.querySelector('.dashboard__quantity').textContent
  });

  return cards;
}

async function getBasicAccountInfo(requestInstance) {
  const accountResponse = await requestInstance({ uri: API.dashboard });
  const cardsAndBalances = getCardsAndBalances(accountResponse);

  return cardsAndBalances;
}

function parseActivity(serverResponse, cardNumber) {
  const dom = new JSDOM(serverResponse.body);
  const error = dom.window.document.getElementById('card-activity--error');
  const data = dom.window.document.querySelectorAll('table#tblTHR tbody tr');
  const transactions = [];

  if (error) {
    return { status: 'error', message: "Sorry, but we don't have any transactions for your PRESTO card for the selected month.", transactions };
  }

  data.forEach(node => {
    const transactionInfo = node.querySelectorAll('td');
    const items = [];

    transactionInfo.forEach(item => {
      items.push(item.textContent.trim());
    });

    transactions.push({
      cardNumber,
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

  return { status: 'success', transactions };
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

async function setCard(requestInstance, cardNumber) {
  try {
    const token = await getCSRF(requestInstance, API.dashboard, `form[action='${API.switchCards}']`);
    const response = await requestInstance({
      uri: API.switchCards,
      method: 'POST',
      form: {
        setFareMediaSession: cardNumber,
        __RequestVerificationToken: token
      },
      withCredentials: true,
      followAllRedirects: true
    });

    return response;
  } catch (error) {
    return error;
  }
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

async function getActivityByDateRange(requestInstance, from, to = moment(), cardNumber) {
  try {
    const fromFormatted = moment(from, 'MM/DD/YYYY').format('MM/DD/YYYY');
    const toFormatted = moment(to, 'MM/DD/YYYY').format('MM/DD/YYYY');
    const dateRange = `${fromFormatted} - ${toFormatted}`;
    const setC = await setCard(requestInstance, cardNumber);
    const resp = await requestInstance({
      uri: API.activityEndpoint,
      method: 'POST',
      json: getActivityRequestBody(dateRange),
      withCredentials: true
    });
    return parseActivity(resp, cardNumber);
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
