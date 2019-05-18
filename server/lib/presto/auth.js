const jsdom = require('jsdom');
const API = require('./api_endpoints');
const { AuthError } = require('./errors');

const { JSDOM } = jsdom;

const INVALID_LOGIN =
  'You could not be signed in to your account. Please check your username/email and password and try again.';

function isSuccessfulLogin(requestBody) {
  return (
    Object.prototype.hasOwnProperty.call(requestBody, 'Result') && requestBody.Result === 'success'
  );
}

const getCSRF = async (
  requestInstance,
  cookieJar,
  endpoint = API.homepage,
  parent = '#signwithaccount'
) => {
  let token;

  try {
    const response = await requestInstance({ uri: endpoint, jar: cookieJar });
    const dom = new JSDOM(response.body);

    token = dom.window.document.querySelector(`${parent} input[name='__RequestVerificationToken']`);
  } catch (error) {
    return error;
  }

  if (!token) {
    throw new AuthError('Could not retrieve CSRF token');
  }

  if (token && !token.hasAttribute('value')) {
    throw new AuthError('Cannot find correct CSRF token');
  }

  return { token: token.value };
};

async function checkLogin(requestInstance) {
  try {
    const response = await requestInstance({ uri: API.dashboard, jar: this.cookieJar });
    const dom = new JSDOM(response.body);
    const isLoggedIn = dom.window.document.querySelector('.signInright');

    if (!isLoggedIn) {
      return {
        Result: 'failed',
        message: 'User is not logged in'
      };
    }

    return { Result: 'success', message: 'User is logged in' };
  } catch (err) {
    return { Result: 'failed', statusCode: err.statusCode };
  }
}

async function login(requestInstance, username, password) {
  try {
    const CSRFResponse = await getCSRF(requestInstance, this.cookieJar);
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
        'User-Agent':
          'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:64.0) Gecko/20100101 Firefox/64.0',
        'X-Requested-With': 'XMLHttpRequest',
        Accept: '*/*',
        Connection: 'keep-alive'
      }
    });

    if (isSuccessfulLogin(loginResponse.body)) {
      return { Result: 'success' };
    }

    return {
      payload: { ...loginResponse.body },
      statusCode: loginResponse.statusCode
    };
  } catch (error) {
    return error;
  }
}

function createCookieJar(requestInstance) {
  return requestInstance.jar();
}

module.exports = {
  createCookieJar,
  checkLogin,
  getCSRF,
  login,
  INVALID_LOGIN
};
