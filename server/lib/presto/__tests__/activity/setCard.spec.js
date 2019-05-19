const { promisify } = require('util');
const nock = require('nock');
const req = require('request');

const API = require('../data/nockApiEndpoints');
const Mock = require('../data/fakeServerResponses');

const options = { baseUrl: API.baseUrl };
const request = promisify(req.defaults(options));
const cj = request.jar();

const { setCard } = require('../../activity');

describe('switch to different card with getCard', () => {
  test('getCard switches successfully', async () => {
    nock(API.baseUrl)
      .get(API.dashboard)
      .reply(200, 'FAIL TO LOAD CSRF TOKEN');

    nock(API.baseUrl)
      .post(API.switchCards)
      .reply(200, 'FAIL TO LOAD CSRF TOKEN');

    const response = await setCard(request, '3139856309122658', cj);

    expect(response).toEqual('3139856309122658');
  });

  test('throw error if getCard calls API successfully but card not switched', async () => {
    nock(API.baseUrl)
      .get(API.dashboard)
      .reply(200, Mock.badHomepage);

    nock(API.baseUrl)
      .post(API.switchCards)
      .reply(200, 'FAIL TO LOAD CSRF TOKEN');

    const response = await setCard(request, '3139856309122658', cj);

    expect(response).toEqual('3139856309122658');
  });
});
