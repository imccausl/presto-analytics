const jsdom = require('jsdom');
const moment = require('moment');
const tough = require('tough-cookie');

const paginationModel = require('./data/paginationModel.json');
const API = require('./api_endpoints');
const { getCSRF } = require('./auth');
const { ParseError, PrestoError } = require('./errors');

const { JSDOM } = jsdom;

/**
 * Utility function to filter out any duplicate properties on an object.
 * @param  {Array}  myArr An array of objects.
 * @param  {String} prop  Potentially duplicate object property to filter out.
 * @return {Array}        An array of objects without the duplicate properties.
 *
 * @private
 */
function removeDuplicates(myArr, prop) {
  return myArr.filter(
    (obj, pos, arr) => arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos
  );
}

/**
 * Parses the Presto /dashboard page to retrieve card numbers and their balances.
 * @param  {String} responseBody   The request response body (html)
 * @return {Array}                 An array containing all cards and their balances.
 *
 * @private
 */
const getCardsAndBalances = responseBody => {
  const dom = new JSDOM(responseBody);
  const scrapeCards = dom.window.document.querySelectorAll('a.fareMediaID');
  const primaryCardNumber = dom.window.document.getElementById('cardNumber');
  const primaryCardBalance = dom.window.document.querySelector('.dashboard__quantity');

  let cards = [];

  if (!scrapeCards[0]) {
    throw new ParseError('a.fareMediaID');
  }

  if (!primaryCardNumber || !primaryCardBalance) {
    throw new ParseError('#cardNumber and/or .dashboard__quantity');
  }

  const data = [...scrapeCards]; // convert NodeList into Array
  const cardsAndBalances = data.map(item => ({
    cardNumber: item.dataset.visibleid,
    balance: item.childNodes[2].textContent.trim()
  }));

  cards = removeDuplicates(cardsAndBalances, 'cardNumber');

  cards.push({
    cardNumber: primaryCardNumber.textContent,
    balance: primaryCardBalance.textContent
  });

  return cards;
};

/**
 * Parses the Presto /dashboard page to retrieve card numbers and their balances.
 * @param  {String} responseBody   The request response body (html)
 * @return {Array}                 An array containing all cards and their balances.
 *
 * @private
 */
const checkFrontmostCard = responseBody => {
  const dom = new JSDOM(responseBody);
  const primaryCardNumber = dom.window.document.getElementById('cardNumber');

  if (!primaryCardNumber) {
    throw new ParseError('#cardNumber');
  }

  return primaryCardNumber.textContent;
};

/**
 * Grabs the transactions associated with a specific card number from the Presto website.
 * @param  {Object} serverResponse The response from the request.
 * @param  {String} cardNumber     The card number the transactions belong to.
 * @return {Object}                An object with the transaction and card number data
 *
 * @private
 */
function parseCardActivity(responseBody, cardNumber) {
  const dom = new JSDOM(responseBody);
  const error = dom.window.document.getElementById('card-activity--error');
  const data = dom.window.document.querySelectorAll('table#tblTHR tbody tr');
  const transactions = [];

  if (error) {
    throw new PrestoError(error.textContent.trim());
  }

  if (data.length === 0) {
    throw new ParseError('table#tblTHR tbody tr');
  }

  data.forEach(node => {
    const transactionInfo = node.querySelectorAll('td');
    const items = [];

    transactionInfo.forEach(item => {
      items.push(item.textContent.trim());
    });

    // In the event that the presto website changes
    // or some other unforseen thing happens where
    // there are less than 8 items in the items array,
    // an error will occur.
    transactions.push({
      cardNumber,
      date: items[0],
      agency: items[2],
      location: items[3],
      type: items[4],
      serviceClass: items[5],
      discount: items[6].replace(/[($)]/g, ''),
      amount: items[7].replace(/[($)]/g, ''),
      balance: items[8].replace(/[($)]/g, '')
    });
  });

  return transactions;
}

/**
 * Create the body of the Presto account activity request.
 * @param  {String} selectedMonth The date range to request from the Presto API.
 * @return {Object}               Formatted Object to send to Presto to request the data.
 *
 * @private
 */
function getActivityRequestBody(selectedMonth) {
  const PAGE_SIZE = 2000;

  return {
    TransactionType: '0',
    Agency: '-1',
    PageSize: PAGE_SIZE,
    selectedMonth,
    currentModel: paginationModel
  };
}

/**
 * Initializes the cookie jar of the Presto object with Presto auth cookies.
 * @param  {Request}   requestInstance Request library dependency.
 * @param  {Object}    userCookies     Cookie data in JSON or Object form.
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
 *
 * @private
 */
async function setCard(requestInstance, cardNumber, jar) {
  const token = await getCSRF(
    requestInstance,
    jar,
    API.dashboard,
    `form[action='/${API.switchCards}']`
  );
  await requestInstance({
    uri: API.switchCards,
    jar,
    method: 'POST',
    form: {
      setFareMediaSession: cardNumber,
      __RequestVerificationToken: token.token
    },
    withCredentials: true,
    followAllRedirects: true
  });
  const response = await requestInstance({
    uri: API.dashboard,
    jar,
    method: 'GET',
    withCredentials: true,
    followAllRedirects: true
  });
  const frontmostCard = checkFrontmostCard(response.body);

  return frontmostCard === cardNumber;
}

/**
 * Sends the request for cards and balance information.
 * @param  {Request} requestInstance An instance of the Request library dependency.
 * @return {Array}                   Array containing cards and their current balances.
 */
async function getBasicAccountInfo(requestInstance) {
  const accountResponse = await requestInstance({ uri: API.dashboard, jar: this.cookieJar });
  const cardsAndBalances = getCardsAndBalances(accountResponse.body);

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
async function getActivityByDateRange(requestInstance, cardNumber, from, to = moment()) {
  const fromFormatted = moment(from, 'MM/DD/YYYY').format('MM/DD/YYYY');
  const toFormatted = moment(to, 'MM/DD/YYYY').format('MM/DD/YYYY');
  const dateRange = `${fromFormatted} - ${toFormatted}`;

  try {
    const setC = await setCard(requestInstance, cardNumber, this.cookieJar);
    const resp = await requestInstance({
      uri: API.activityEndpoint,
      jar: this.cookieJar,
      method: 'POST',
      json: getActivityRequestBody(dateRange),
      withCredentials: true
    });
    const transactions = parseCardActivity(resp.body, cardNumber);

    if (!setC) {
      return {
        Result: 'failed',
        message: 'Card was not changed'
      };
    }

    return { Result: 'success', transactions };
  } catch (err) {
    throw err;
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
      'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:64.0) Gecko/20100101 Firefox/64.0',
      'X-Requested-With': 'XMLHttpRequest',
      Accept: '*/*',
      Connection: 'keep-alive'
    }
  });

  // return parseUsageReport(resp); //selector: #tblTUR
}

module.exports = {
  getUsageReport,
  getBasicAccountInfo,
  getActivityByDateRange,
  setCookieJar,

  /* exported for tests */
  removeDuplicates,
  getCardsAndBalances,
  parseCardActivity,
  getActivityRequestBody,
  setCard
};
