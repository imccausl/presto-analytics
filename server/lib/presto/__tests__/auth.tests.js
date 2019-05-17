const nock = require('nock');

const API = require('./helpers/nockApiEndpoints');
const Presto = require('../../presto');

beforeEach(() => {
  const CSRFScope = nock(API.baseUrl)
    .defaultReplyHeaders({ 'Content-Type': 'text/html; charset=utf-8' })
    .get(API.homepage)
    .reply(200, {
      body:
        '<html lang="en"><head><meta charset="utf-8"></head><body><input id="signwithaccount" type="hidden" name="__RequestVerificationToken" value="testCSRFtokenvalue"></body></html>'
    });
});

describe('logging into presto', () => {
  const scope = nock(API.baseUrl)
    .post(API.loginEnpoint, 'username=pgte&password=123456')
    .reply(200, {
      Result: 'success'
    });
  test('can log in', async () => {
    const presto = new Presto();
    const response = await presto.login('test', 'test');

    expect(response.statusCode).toBe(200);
    expect(response.body).toBe({ Result: 'success' });
  });
});
