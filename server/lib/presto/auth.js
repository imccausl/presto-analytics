const jsdom = require('jsdom');
const API = require('./api_endpoints');

const { JSDOM } = jsdom;
const cookieJar = new jsdom.CookieJar();

const INVALID_LOGIN = 'You could not be signed in to your account. Please check your username/email and password and try again.';

function isSuccessfulLogin(requestBody) {
  return Object.prototype.hasOwnProperty.call(requestBody, 'Result') && requestBody.Result === 'success';
}

async function getCSRF(requestInstance, endpoint = API.homepage, parentId = 'signwithaccount') {
  try {
    const { body } = await requestInstance({ uri: endpoint });
    const dom = new JSDOM(body, { cookieJar });
    const token = dom.window.document.querySelector(`#${parentId} input[name='__RequestVerificationToken']`);

    return token ? token.value : '';
  } catch (error) {
    return { error };
  }
}

async function login(requestInstance, username, password) {
  const token = await getCSRF(requestInstance);

  if (typeof token === 'object') {
    return {
      success: false,
      error: token.error
    };
  }

  const loginResponse = await requestInstance({
    uri: API.loginEndpoint,
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
  });

  if (isSuccessfulLogin(loginResponse.body)) {
    return { success: true };
  }

  return {
    success: false,
    error: loginResponse.body,
    code: loginResponse.statusCode
  };
}

async function isLoggedIn(responseInstance) {
  try {
    const resp = await responseInstance({ uri: API.dashboard });

    if (resp.statusCode !== 200) {
      return false;
    }

    const dom = new JSDOM(resp.body);
    return dom.window.document.querySelectorAll('.signInSignOut').length > 0;
  } catch (err) {
    return false;
  }
}

module.exports = {
  isSuccessfulLogin,
  getCSRF,
  login,
  isLoggedIn,
  INVALID_LOGIN
};
