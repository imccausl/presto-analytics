const { promisify } = require('util');
const fs = require('fs');
const path = require('path');

const Mock = require('./data/fakeServerResponses');

const { ParseError } = require('../errors');
const { getCardsAndBalances } = require('../activity');

describe('getCardsAndBalances()', () => {
  const readFile = promisify(fs.readFile);
  const filePath = path.join(__dirname, './data/pages/dashboard.html');

  test('return an array of all cards and balances', async () => {
    const html = await readFile(filePath, 'utf-8');
    const scrapedData = getCardsAndBalances(html);

    expect(scrapedData).toStrictEqual([
      { balance: '($1.25)', cardNumber: '31240105719720304' },
      { balance: '$20.65', cardNumber: '3139856309122658' }
    ]);
  });

  test('should throw ParseError if required selector a.fareMediaID is missing', () => {
    const parseErrorTest = () => {
      getCardsAndBalances(Mock.homepage);
    };
    expect(parseErrorTest).toThrow(new ParseError('a.fareMediaID'));
  });

  test('should throw ParseError if required selector "#cardNumber" and/or ".dashboard__quantity" is missing', () => {
    const parseErrorTest = () => {
      getCardsAndBalances(Mock.dashboard);
    };

    expect(parseErrorTest).toThrow(new ParseError('#cardNumber and/or .dashboard__quantity'));
  });
});
