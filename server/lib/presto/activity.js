const jsdom = require('jsdom');
const moment = require('moment');
const tough = require('tough-cookie');

const paginationModel = require('./data/paginationModel.json');
const API = require('./api_endpoints');
const { getCSRF } = require('./auth');

const { JSDOM } = jsdom;

/**
 * Utility function to filter out any duplicate properties on an object.
 * @param  {Array}  myArr An array of objects.
 * @param  {String} prop  Potentially duplicate object property to filter out.
 * @return {Array}        An array of objects without the duplicate properties.
 */
function removeDuplicates(myArr, prop) {
  return myArr.filter(
    (obj, pos, arr) => arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos
  );
}

/**
 * Parses the Presto /dashboard page to retrieve card numbers and their balances.
 * @param  {Object} serverResponse The request response
 * @return {Array}                 An array containing all cards and their balances.
 */
const getCardsAndBalances = serverResponse => {
  const dom = new JSDOM(serverResponse.body);
  const scrapeCards = dom.window.document.querySelectorAll('a.fareMediaID');
  let cards = [];

  if (scrapeCards) {
    const data = [...scrapeCards]; // convert NodeList into Array
    const cardsAndBalances = data.map(item => ({
      cardNumber: item.dataset.visibleid,
      balance: item.childNodes[2].textContent.trim()
    }));
    cards = removeDuplicates(cardsAndBalances, 'cardNumber');
  }

  cards.push({
    cardNumber: dom.window.document.getElementById('cardNumber').textContent,
    balance: dom.window.document.querySelector('.dashboard__quantity').textContent
  });

  return cards;
};

/**
 * Grabs the transactions associated with a specific card number from the Presto website.
 * @param  {Object} serverResponse The response from the request.
 * @param  {String} cardNumber     The card number the transactions belong to.
 * @return {Object}                An object with the transaction and card number data
 */
function parseActivity(serverResponse, cardNumber) {
  const dom = new JSDOM(serverResponse.body);
  const error = dom.window.document.getElementById('card-activity--error');
  const data = dom.window.document.querySelectorAll('table#tblTHR tbody tr');
  const transactions = [];

  if (error) {
    return {
      status: 'error',
      message:
        "Sorry, but we don't have any transactions for your PRESTO card for the selected month.",
      transactions
    };
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

/**
 * Create the body of the Presto account activity request.
 * @param  {String} selectedMonth The date range to request from the Presto API.
 * @return {Object}               Formatted Object to send to Presto to request the data.
 */
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

/**
 * Initializes the cookie jar of the Presto object with Presto auth cookies.
 * @param  {Request}   requestInstance Request library dependency.
 * @param  {Object }   userCookies     Cookie data in JSON or Object form.
 * @return {CookieJar}                 Cookiejar object with Presto auth cookies.
 */
function setCookieJar(requestInstance, userCookies) {
  const cj = requestInstance.jar();
  if (userCookies) {
    const cookieData = typeof userCookies === 'string' ? JSON.parse(userCookies) : userCookies;
    const cookies = [];

    cookieData.forEach(cookie => {
      const { key, value, domain, path, secure, httpOnly, hostOnly } = cookie;

      cookies.push(
        new tough.Cookie({
          key,
          value,
          domain,
          path,
          secure,
          httpOnly,
          hostOnly
        })
      );
    });

    cookies.forEach(cookie => {
      console.log('cookie:', cookie);
      cj.setCookie(cookie.toString(), `${API.baseUrl}`);
    });
  }

  this.cookieJar = cj;
}

/**
 * Request that activity from the specified card be popualted on the Presto /dashboard.
 * @param  {Request}   requestInstance Instance of the Request library dependency.
 * @param  {String}    cardNumber      The card number of the user to switch to.
 * @param  {CookieJar} jar             The cookie jar containing the necessary auth cookies.
 * @return {Object}                    The server's response.
 */
async function setCard(requestInstance, cardNumber, jar) {
  try {
    const cj = jar;
    const token = await getCSRF(
      requestInstance,
      cj,
      API.dashboard,
      `form[action='/${API.switchCards}']`
    );
    console.log('Token:', token);
    const response = await requestInstance({
      uri: API.switchCards,
      jar: cj,
      method: 'POST',
      form: {
        setFareMediaSession: cardNumber,
        __RequestVerificationToken: token.token
      },
      withCredentials: true,
      followAllRedirects: true
    });

    return response;
  } catch (error) {
    return error;
  }
}

/**
 * Sends the request for cards and balance information.
 * @param  {Request} requestInstance An instance of the Request library dependency.
 * @return {Array}                   Array containing cards and their current balances.
 */
async function getBasicAccountInfo(requestInstance) {
  const accountResponse = await requestInstance({ uri: API.dashboard, jar: this.cookieJar });
  const cardsAndBalances = getCardsAndBalances(accountResponse);

  return cardsAndBalances;
}

/**
 * Return account activity from the specified card, for the specified date range.
 * @param  {Request} requestInstance An instance of the Request library dependency.
 * @param  {Date}    from            The start of the date range.
 * @param  {Date}    to              The end of the date range.
 * @param  {String}  cardNumber      The card number you want the activity from.
 * @return {Object}                  The parsed activity for the specified card.
 */
async function getActivityByDateRange(requestInstance, from, to = moment(), cardNumber) {
  try {
    const fromFormatted = moment(from, 'MM/DD/YYYY').format('MM/DD/YYYY');
    const toFormatted = moment(to, 'MM/DD/YYYY').format('MM/DD/YYYY');
    const dateRange = `${fromFormatted} - ${toFormatted}`;

    const setC = await setCard(requestInstance, cardNumber, this.cookieJar);
    const resp = await requestInstance({
      uri: API.activityEndpoint,
      jar: this.cookieJar,
      method: 'POST',
      json: getActivityRequestBody(dateRange),
      withCredentials: true
    });
    return parseActivity(resp, cardNumber);
  } catch (error) {
    return { error };
  }
}

/** CURRENTLY NOT FUNCTIONAL
 ** (Replaced with getActivityByDateRange not sure if this is still useful.
 **  Keeping it here for now because I may revive it)
 ** Returns the transit activity report for the specified year
 * @param {Request} requestInstance An instance of the Request library dependency.
 * @param {String}  year            The year pertaining to the activity you want.
 */
async function getUsageReport(requestInstance, year) {
  try {
    const token = await getCSRF(requestInstance, API.usageReport, 'TransitUsageReport');
    const searchYear =
      (typeof year === 'number' ? year.toString() : year) || new Date().getFullYear().toString();
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
        __RequestVerificationToken: token.token,
        'Accept-Language': 'en-US,en;q=0.5',
        'Content-Type': 'application/json; charset=utf-8',
        Referrer: 'https://www.prestocard.ca/en/dashboard/card-activity',
        'User-Agent':
          'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:64.0) Gecko/20100101 Firefox/64.0',
        'X-Requested-With': 'XMLHttpRequest',
        Accept: '*/*',
        Connection: 'keep-alive'
      }
    });

    // return parseUsageReport(resp); //selector: #tblTUR
  } catch (error) {
    return { error };
  }
}

module.exports = {
  getUsageReport,
  getBasicAccountInfo,
  getActivityByDateRange,
  setCookieJar
};
