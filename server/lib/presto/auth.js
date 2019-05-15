const jsdom = require('jsdom');
const API = require('./api_endpoints');

const { JSDOM } = jsdom;

const INVALID_LOGIN =
  'You could not be signed in to your account. Please check your username/email and password and try again.';

function isSuccessfulLogin(requestBody) {
  return (
    Object.prototype.hasOwnProperty.call(requestBody, 'Result') && requestBody.Result === 'success'
  );
}

async function getCSRF(requestInstance, endpoint = API.homepage, parent = '#signwithaccount') {
  try {
    const { body } = await requestInstance({ uri: endpoint, jar: this.cookieJar });
    const dom = new JSDOM(body);
    const token = dom.window.document.querySelector(
      `${parent} input[name='__RequestVerificationToken']`
    );
    if (!token) {
      throw new Error(
        'Could not get token. Session may have expired or user was not logged in correctly.'
      );
    }

    return { token: token.value };
  } catch (error) {
    console.log(error);
    return { error };
  }
}

async function login(requestInstance, username, password) {
  const CSRFResponse = await getCSRF(requestInstance);

  if (typeof CSRFResponse.token !== 'string') {
    return {
      success: false,
      error: CSRFResponse.error
    };
  }

  const loginResponse = await requestInstance({
    uri: API.loginEndpoint,
    jar: this.cookieJar,
    method: 'POST',
    json: {
      anonymousOrderACard: false,
      custSecurity: {
        Login: username,
        Password: password,
        __RequestVerificationToken: CSRFResponse.token
      }
    },
    headers: {
      __RequestVerificationToken: CSRFResponse.token,
      'Accept-Language': 'en-US,en;q=0.5',
      'Content-Type': 'application/json; charset=utf-8',
      Referrer: 'https://www.prestocard.ca/home',
      'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:64.0) Gecko/20100101 Firefox/64.0',
      'X-Requested-With': 'XMLHttpRequest',
      Accept: '*/*',
      Connection: 'keep-alive'
    }
  });

  if (isSuccessfulLogin(loginResponse.body)) {
    console.log('cookieJar:', this.cookieJar);
    console.log('login Cookies:', this.getCookieJar());
    return { success: true };
  }

  return {
    success: false,
    error: loginResponse.body,
    code: loginResponse.statusCode
  };
}

async function isLoggedIn(requestInstance, jar) {
  const cj = jar || requestInstance.jar();

  try {
    const resp = await requestInstance({ uri: API.dashboard, jar: cj });

    if (resp.statusCode !== 200) {
      return false;
    }

    const dom = new JSDOM(resp.body);
    return dom.window.document.querySelectorAll('.signInSignOut').length > 0;
  } catch (err) {
    return false;
  }
}

function createCookieJar(requestInstance) {
  return requestInstance.jar();
}

module.exports = {
  createCookieJar,
  isSuccessfulLogin,
  getCSRF,
  login,
  isLoggedIn,
  INVALID_LOGIN
};
