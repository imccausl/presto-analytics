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

const loginRequestBody = {
  anonymousOrderACard: false,
  custSecurity: {
    Login: 'test',
    Password: 'test',
    __RequestVerificationToken: 'testCSRFtokenvalue'
  }
};

module.exports = {
  homepage,
  loginRequestBody
};
