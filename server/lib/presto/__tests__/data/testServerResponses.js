const { INVALID_LOGIN } = require('../../auth');

const homepage = `
    <html lang="en">
        <head>
            <meta charset="utf-8">
        </head>

        <body>
            <form id="signwithaccount">
                <input type="hidden" name="__RequestVerificationToken" value="testCSRFtokenvalue">
            </form>
        </body>
    </html>`;

const dashboard = `
    <html lang="en">
        <head>
            <meta charset="utf-8">
        </head>

        <body>
            <a class="signInSignOut signInright" href="/api/sitecore/AFMSAuthentication/Logout">
                Sign Out
            </a>
        </body>
    </html>`;

const loginRequestBody = {
  anonymousOrderACard: false,
  custSecurity: {
    Login: 'test',
    Password: 'test',
    __RequestVerificationToken: 'testCSRFtokenvalue'
  }
};

const loginSuccessPayload = {
  Result: 'success'
};

const loginFailedPayload = {
  Result: 'failed',
  message: INVALID_LOGIN
};

module.exports = {
  homepage,
  dashboard,
  loginRequestBody,
  loginSuccessPayload,
  loginFailedPayload
};
