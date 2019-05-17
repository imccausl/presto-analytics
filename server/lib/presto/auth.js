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
  try {
    const response = await requestInstance({ uri: endpoint, jar: cookieJar });
    const dom = new JSDOM(response.body);

    const token = dom.window.document.querySelector(
      `${parent} input[name='__RequestVerificationToken']`
    );

    if (token && !token.value) {
      throw new Error(
        'Could not get token. Session may have expired or user was not logged in correctly.'
      );
    }

    return { token: token.value };
  } catch (error) {
    console.log(error);
    return { error };
  }
};

/*
Stuff from the server indicating an error
<div class="form-group signinwithoutaccount08">
<label for="SignIn_Password">Password*</label>
<input class="signin-input form-control signin-tabs_input valid" id="SignIn_Password" autocomplete="off" type="password" data-daxmapper="Password" name="Password" aria-required="true" data-com.agilebits.onepassword.user-edited="yes" data-op-id="1" aria-describedby="error_SignIn_Password">
<span for="SignIn_Password" class="error" id="error_SignIn_Password" style="display: none;">Your password must contain a minimum of one letter, one number, and be a minimum of six characters in length.</span></div>

<div id="loginError" class="errorMsg error-message">You could not be signed in to your account. Please check your username/email and password and try again.</div>

*/

async function login(requestInstance, username, password) {
  try {
    const CSRFResponse = await getCSRF(requestInstance, this.cookieJar);

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
        'User-Agent':
          'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:64.0) Gecko/20100101 Firefox/64.0',
        'X-Requested-With': 'XMLHttpRequest',
        Accept: '*/*',
        Connection: 'keep-alive'
      }
    });

    if (isSuccessfulLogin(loginResponse.body)) {
      return { payload: { ...loginResponse.body }, statusCode: loginResponse.statusCode };
    }

    return {
      payload: { ...loginResponse.body },
      statusCode: loginResponse.statusCode
    };
  } catch (error) {
    return error;
  }
}

async function checkLogin(requestInstance, cookieJar) {
  if (!cookieJar || typeof cookieJar !== 'object') {
    throw new Error('Cookie Jar data either missing or invalid.');
  }

  try {
    const response = await requestInstance({ uri: API.dashboard, jar: cookieJar });

    if (response.statusCode !== 200) {
      throw new Error();
    }

    if (response === INVALID_LOGIN) {
      return { status: 'failed', message: response.body, statusCode: response.statusCode };
    }

    const dom = new JSDOM(response.body);
    return dom.window.document.querySelectorAll('.signInSignOut').length > 0;
  } catch (err) {
    return { Result: 'failed', statusCode: err.statusCode };
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
  INVALID_LOGIN
};
