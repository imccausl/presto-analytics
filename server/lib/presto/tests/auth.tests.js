const nock = require('nock');

const API = require('../api_endpoints');

describe('logging into presto', () => {
  beforeEach(() => {
    const scope = nock(API.baseUrl)
      .post(API.loginEnpoint)
      .reply(200, {
        Result: 'success'
      });
  });
  test('can log in', async () => {});
});
