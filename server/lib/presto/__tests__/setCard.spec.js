const { promisify } = require('util');

const nock = require('nock');
const req = require('request');

const API = require('./data/nockApiEndpoints');
const Mock = require('./data/fakeServerResponses');

const { loadHtmlResponse } = Mock;

const options = { baseUrl: API.baseUrl };
const request = promisify(req.defaults(options));
const cj = request.jar();

const { setCard } = require('../activity');

describe('switch to different card with getCard', () => {
  test('getCard switches successfully', async () => {
    const firstActivityResponse = await loadHtmlResponse('../data/pages/dashboard.html');
    const otherCardDashboard = await loadHtmlResponse('../data/pages/dashboard-other-card.html');

    // Fake CSRF
    nock(API.baseUrl)
      .get(API.dashboard)
      .reply(200, firstActivityResponse);

    // switch card API
    nock(API.baseUrl)
      .post(API.switchCards)
      .reply(200); // Presto API actually returns 302 on success

    // load dashboard check
    nock(API.baseUrl)
      .get(API.dashboard)
      .reply(200, otherCardDashboard);

    const response = await setCard(request, '31240105719720304', cj);

    expect(response).toBe(true);
  });

  test('return false if card does not switch', async () => {
    const firstActivityResponse = await loadHtmlResponse('../data/pages/card-activity.html');

    nock(API.baseUrl)
      .get(API.dashboard)
      .reply(200, firstActivityResponse);

    nock(API.baseUrl)
      .post(API.switchCards)
      .reply(200, '');

    // load dashboard check
    nock(API.baseUrl)
      .get(API.dashboard)
      .reply(200, firstActivityResponse);

    const response = await setCard(request, '31240105719720304', cj);

    await expect(response).toBe(false);
  });
});
