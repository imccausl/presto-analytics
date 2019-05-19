const { promisify } = require('util');
const nock = require('nock');
const req = require('request');

const API = require('./data/nockApiEndpoints');
const Mock = require('./data/fakeServerResponses');

const options = { baseUrl: API.baseUrl };
const request = promisify(req.defaults(options));
const cj = request.jar();

const { AuthError } = require('../errors');
const { getCSRF } = require('../auth');

describe('CSRF scraping', () => {
  test('getCSRF throws AuthError if token not found', async () => {
    nock(API.baseUrl)
      .get(API.homepage)
      .reply(200, 'FAIL TO LOAD CSRF TOKEN');

    await expect(getCSRF(request, cj)).resolves.toThrow(
      new AuthError('Could not retrieve CSRF token')
    );
  });

  test('getCSRF throws AuthError if input element exists but no value attr', async () => {
    nock(API.baseUrl)
      .get(API.homepage)
      .reply(200, Mock.badHomepage);

    await expect(getCSRF(request, cj)).resolves.toThrow(
      new AuthError('Cannot find correct CSRF token')
    );
  });

  test('getCSRF() finds correct login token', async () => {
    nock(API.baseUrl)
      .get(API.homepage)
      .reply(200, Mock.homepage);

    const { token } = await getCSRF(request, cj);

    expect(token).toEqual('testCSRFtokenvalue');
  });
});
