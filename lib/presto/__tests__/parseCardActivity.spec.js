const Mock = require('./data/fakeServerResponses');

const { loadHtmlResponse } = Mock;

const { ParseError, PrestoError } = require('../errors');
const { parseCardActivity } = require('../activity');

describe('parseCardActivity()', () => {
  test('return a JSON formatted object if all card activity on page', async () => {
    const html = await loadHtmlResponse('../data/pages/card-activity.html');

    const scrapedData = parseCardActivity(html, '3139856309122658');

    expect(scrapedData).toStrictEqual(Mock.expectedCardActivity);
  });

  test('throws PrestoError if error returned from presto', async () => {
    const html = await loadHtmlResponse('../data/pages/card-activity-error.html');

    const parseErrorTest = () => {
      parseCardActivity(html, '3139856309122658');
    };
    expect(parseErrorTest).toThrow(
      new PrestoError(
        `Sorry, but we don't have any transactions for your PRESTO card for the selected month.`
      )
    );
  });

  test('throws ParseError if no transaction found on page', () => {
    const parseErrorTest = () => {
      parseCardActivity(Mock.homepage, '3139856309122658');
    };

    expect(parseErrorTest).toThrow(new ParseError('table#tblTHR tbody tr'));
  });
});
