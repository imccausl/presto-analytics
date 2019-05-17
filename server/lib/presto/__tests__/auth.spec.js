const nock = require('nock');

const API = require('./data/nockApiEndpoints');
const Mock = require('./data/testServerResponses');

const Presto = require('..');

beforeEach(() => {
  /* CSRF Scrape before the login request */
  nock(API.baseUrl)
    .defaultReplyHeaders({ 'Content-Type': 'text/html; charset=utf-8' })
    .get(API.homepage)
    .reply(200, Mock.homepage);

  /* Fake Login API Server */
  nock(API.baseUrl)
    .post(API.loginEndpoint, Mock.loginRequest)
    .reply(200, (uri, requestBody) => {
      const TEST_PASSWORD = 'test';
      const TEST_USERNAME = 'test';
      const request = JSON.parse(requestBody);

      if (
        request.custSecurity.Login === TEST_USERNAME &&
        request.custSecurity.Password === TEST_PASSWORD
      ) {
        return Mock.loginSuccessPayload;
      }

      return Mock.loginFailedPayload;
    });

  nock(API.baseUrl)
    .get(API.dashboard)
    .reply();
});

afterEach(() => nock.cleanAll());

describe('authenticate with presto', () => {
  test('correct credentials should return success message', async () => {
    const presto = new Presto();
    const response = await presto.login('test', 'test');

    expect(response.statusCode).toBe(200);
    expect(response.payload).toEqual(Mock.loginSuccessPayload);
  });

  test('incorrect credentials should return failed message', async () => {
    const presto = new Presto();
    const response = await presto.login('test', 'wrong');

    expect(response.statusCode).toBe(200);
    expect(response.payload).toEqual(Mock.loginFailedPayload);
  });

  test('user is logged in', async () => {
    const presto = new Presto();
    const response = await presto.login('test', 'test');

    expect(response.statusCode).toBe(200);
    expect(response.payload).toEqual({ Result: 'success', message: 'User is logged in.' });
  });

  test('user is not logged in', async () => {
    const presto = new Presto();
    const response = await presto.login('test', 'test');

    expect(response.payload).toEqual({ Result: 'failed', message: 'User is not logged in' });
  });
});
