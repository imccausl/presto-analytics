const { promisify } = require('util');
const fs = require('fs');
const path = require('path');

const { authErrors } = require('../../auth');

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

const badHomepage = `
    <html lang="en">
        <head>
            <meta charset="utf-8">
        </head>

        <body>
            <form id="signwithaccount">
                <input type="hidden" name="__RequestVerificationToken">
            </form>
        </body>
    </html>`;

const dashboard = `
    <html lang="en">
        <head>
            <meta charset="utf-8">
        </head>

        <a href="#" onclick="submitDetailsForm(this)" data-visibleid="31240105719720304" aria-label="Select PRESTO card Presto with a balance of ($1.25)" class="fareMediaID"></a>

        <body>
            <a class="signInSignOut signInright" href="/api/sitecore/AFMSAuthentication/Logout">
                Sign Out
            </a>

            <form action="/api/sitecore/Global/RedirectToSearch" method="post">
                <input name="__RequestVerificationToken" type="hidden" value="iKAXKzO_PmGv2kMxwv4iGGi56pdT_9K6E_Qfa9_LEsjFElfxzKjwQ0njCbMdYIqb7q4knoJm5kI_Kqy59DCxT44crEEWRaJToKHvgBvJ1cw1" id="inputCTID0">
            </form>

            <form action="/api/sitecore/Dashboard/CardActivity" class="form-horizontal CardActivity" id="CardActivity" method="post">
                <input name="__RequestVerificationToken" type="hidden" value="aEmdRvLoJ_uq3zwkzSUn-SJ6EyBhcfzImjBm8k8_zbv5TMP0kHKUoRcytGT2pxpcUWvdQ1Gf-Ekcgia5fSv3mMXLSHl2WHPlB0MaC4yFGo84WsOsZ9t6IX4sUehV7zXT0" id="inputCTID49">
            </form>

            <form action="/api/sitecore/Global/UpdateFareMediaSession?id=lowerFareMediaId&amp;class=lowerFareMediaId" method="post">
                <input name="__RequestVerificationToken" type="hidden" value="R6X8Qwb4TX4R7XFFX8fqaYvqSvzn34HY-mw1kJUsy-6Y1hA68eAsKUt37hPTIsAIgq2DOUWoxHXVWh9YmH74h3w1uk1x5zhFPWsradbF99DKunjXqum-HWigAjlyNIJd0" id="inputCTID2">
            </form>

            <form action="/api/sitecore/Global/RedirectToSearch" id="submitForm" method="post">
                <input name="__RequestVerificationToken" type="hidden" value="jVgefN2jy7q5K5C5ySszFhwe3DHeZfLXC_jUoyKyQB9FKK_AZH8B2axV_jzZydRjZ81xgz3L8brmJ6xpsltzoJ8-L62j9X_MJejNx2Emc8GhMMeVhdExUcDS8t23knG50" id="inputCTID4">
            </form>

            <form action="/api/sitecore/Global/UpdateFareMediaSession?id=lowerFareMediaId&amp;class=lowerFareMediaId" method="post">
                <input name="__RequestVerificationToken" type="hidden" value="LBnhBQO4tWyVCQQLdbOHUdVy3hjwR2Qm5GTfkuBD-b5xwZ-NaJEkDvTbTVPCCB7sWnD-ii5nVSFeN5LyJK3v21FMhZwf4A2gp5eGo7U3AtZQ8OXT0z6oP5lxvstA-gV70" id="inputCTID6">
            </form>

            <form action="/api/sitecore/AFMSAuthentication/CreateAnAccountPost" class="tab-content" id="CreateAccountPage" method="post">
                <input name="__RequestVerificationToken" type="hidden" value="ceM2qCiHDmV8mDHk-Mdb7oqty9MtUpvFkFVx4dvYOVzn_5yRtyoAhqPbcqHrRENz8FnopShbtZ9mie8HP0cJRsllw0Ivlz4WotndBtKyxVMelqIM_1VvcRKeh_PmQBDW0" id="inputCTID9">
            </form>

            <form method="post" id="AutoRenewSetupPost">
                <input name="__RequestVerificationToken" type="hidden" value="S3n1l7z-mOqVxzgOTb_-cv8UKfKpIEB-98BIMRS2vUvuezbXamL2nEqr5fHCYP6tEH764IALhhwBEf7r8H-GNhqgvM9WxkGRSdlE7xS9NANdNz1BF7KICnwxkqvkLDep0" id="inputCTID36">
            </form>

        </body>
    </html>`;

const expectedCardActivity = [
  {
    agency: 'Toronto Transit Commission',
    amount: '3.10',
    balance: '3.85',
    cardNumber: '3139856309122658',
    date: '4/30/2019 8:08:43 PM',
    discount: '0.00',
    location: 'BAY STATION',
    serviceClass: 'Regular',
    type: 'Fare Payment'
  },
  {
    agency: 'Toronto Transit Commission',
    amount: '3.10',
    balance: '6.95',
    cardNumber: '3139856309122658',
    date: '4/30/2019 7:29:56 AM',
    discount: '0.00',
    location: 'PAPE STATION',
    serviceClass: 'Regular',
    type: 'Fare Payment'
  },
  {
    agency: 'Toronto Transit Commission',
    amount: '3.10',
    balance: '10.05',
    cardNumber: '3139856309122658',
    date: '4/29/2019 5:28:57 PM',
    discount: '0.00',
    location: 'BAY STATION',
    serviceClass: 'Regular',
    type: 'Fare Payment'
  },
  {
    agency: 'Toronto Transit Commission',
    amount: '3.10',
    balance: '13.15',
    cardNumber: '3139856309122658',
    date: '4/29/2019 7:41:19 AM',
    discount: '0.00',
    location: 'PAPE STATION',
    serviceClass: 'Regular',
    type: 'Fare Payment'
  },
  {
    agency: 'Toronto Transit Commission',
    amount: '3.10',
    balance: '16.25',
    cardNumber: '3139856309122658',
    date: '4/27/2019 2:34:19 PM',
    discount: '0.00',
    location: 'ST CLAIR WEST STATION',
    serviceClass: 'Regular',
    type: 'Fare Payment'
  },
  {
    agency: 'Toronto Transit Commission',
    amount: '3.10',
    balance: '19.35',
    cardNumber: '3139856309122658',
    date: '4/27/2019 11:42:28 AM',
    discount: '0.00',
    location: 'PAPE STATION',
    serviceClass: 'Regular',
    type: 'Fare Payment'
  },
  {
    agency: 'Toronto Transit Commission',
    amount: '3.10',
    balance: '22.45',
    cardNumber: '3139856309122658',
    date: '4/26/2019 7:43:47 PM',
    discount: '0.00',
    location: 'BAY STATION',
    serviceClass: 'Regular',
    type: 'Fare Payment'
  },
  {
    agency: 'Toronto Transit Commission',
    amount: '3.10',
    balance: '25.55',
    cardNumber: '3139856309122658',
    date: '4/26/2019 7:31:55 AM',
    discount: '0.00',
    location: 'PAPE STATION',
    serviceClass: 'Regular',
    type: 'Fare Payment'
  },
  {
    agency: 'Toronto Transit Commission',
    amount: '3.10',
    balance: '28.65',
    cardNumber: '3139856309122658',
    date: '4/25/2019 5:56:48 PM',
    discount: '0.00',
    location: 'BAY STATION',
    serviceClass: 'Regular',
    type: 'Fare Payment'
  },
  {
    agency: 'Toronto Transit Commission',
    amount: '30.00',
    balance: '0.00',
    cardNumber: '3139856309122658',
    date: '4/25/2019 5:56:19 PM',
    discount: '0.00',
    location: 'BAY STATION',
    serviceClass: '',
    type: 'Payment By Credit'
  }
];
const loginRequestBody = {
  anonymousOrderACard: false,
  custSecurity: {
    Login: 'test',
    Password: 'test',
    __RequestVerificationToken: 'testCSRFtokenvalue'
  }
};

const cardsAndBalances = [
  { balance: '($1.25)', cardNumber: '31240105719720304' },
  { balance: '$20.65', cardNumber: '3139856309122658' }
];

const loginSuccess = {
  Result: 'success',
  cards: cardsAndBalances
};

const loginFailed = {
  Result: 'failed',
  message: 'INVALID_LOGIN'
};

const attemptLimitExceeded = {
  Result: 'failed',
  message: 'ATTEMPT_LIMIT_EXCEEDED'
};

const failedCardChange = { Result: 'failed', message: 'Card was not changed' };

async function loadHtmlResponse(htmlPath) {
  const readFile = promisify(fs.readFile);
  const filePath = path.join(__dirname, htmlPath);

  return readFile(filePath, 'utf-8');
}

module.exports = {
  homepage,
  badHomepage,
  dashboard,
  loginRequestBody,
  loginSuccess,
  loginFailed,
  attemptLimitExceeded,
  loadHtmlResponse,
  expectedCardActivity,
  failedCardChange,
  cardsAndBalances
};
