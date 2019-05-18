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
  badHomepage,
  dashboard,
  loginRequestBody,
  loginSuccessPayload,
  loginFailedPayload
};
