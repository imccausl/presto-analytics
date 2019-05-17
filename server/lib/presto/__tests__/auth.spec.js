const nock = require('nock');

const API = require('./data/nockApiEndpoints');
const Mock = require('./data/testServerResponses');

const Presto = require('..');

beforeEach(() => {
  const CSRFScope = nock(API.baseUrl)
    .defaultReplyHeaders({ 'Content-Type': 'text/html; charset=utf-8' })
    .get(API.homepage)
    .reply(200, Mock.homepage);
});

describe('logging into presto', () => {
  nock(API.baseUrl)
    .post(API.loginEndpoint, Mock.loginRequest)
    .reply(200, {
      Result: 'success'
    });

  test('can log in', async () => {
    const presto = new Presto();
    const response = await presto.login();

    expect(response.statusCode).toBe(200);
    expect(response.success).toBe(true);
  });
});
