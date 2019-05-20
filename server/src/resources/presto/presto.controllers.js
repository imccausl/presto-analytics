const moment = require('moment');

const Presto = require('../../../lib/presto');

const User = require('../user/user.model');
const Transaction = require('../transaction/transaction.model');

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    console.log('Logging in!');

    if (!username && !password) {
      throw new Error('Invalid request body');
    }

    if (!req.userId) {
      throw new Error('You must be logged in to do this');
    }

    const presto = new Presto();
    const prestoLoginResp = await presto.login(username, password);

    const user = await User.findOne({
      where: {
        id: req.userId
      }
    });

    console.log(prestoLoginResp.body);

    prestoLoginResp.accountInfo = prestoLoginResp.cards;
    user.cookies = presto.getCookies();
    user.cards = prestoLoginResp.cards;
    user.save();

    res.json(prestoLoginResp);
  } catch (error) {
    next(error);
  }
};

const checkLogin = async (req, res, next) => {
  const presto = new Presto();
  const response = await presto.checkLogin();
  console.log(response);

  if (response.Result === 'success') {
    res.json({ status: 'success', message: 'Logged in to Presto.' });
  } else {
    res.json({ status: 'error', message: 'Not logged in to Presto' });
  }
};

const usage = async (req, res, next) => {
  try {
    let { from, to, cards } = req.body;
    let filterDateString = '';
    let transactions = [];
    const filteredUsage = [];
    cards = typeof cards === 'string' ? JSON.parse(cards) : cards;
    if (!req.userId) {
      throw new Error('No user logged in!');
    }
    const userCookies = await User.findOne({
      where: {
        id: req.userId
      },
      attributes: ['cookies']
    });

    const presto = new Presto(userCookies.cookies);

    for (let i = 0; i < cards.length; i++) {
      const cardNumber = cards[i];

      console.log('Getting from card number: ', cardNumber);
      const lastTransactionDate = await Transaction.max('date', {
        where: {
          userId: req.userId,
          cardNumber
        }
      });

      if (lastTransactionDate) {
        from = moment(lastTransactionDate).format('MM/DD/YYYY');
        filterDateString = moment(lastTransactionDate).format('MM/DD/YYYY hh:mm:ss A');
      }

      console.log('lastTransactionDate:', !!lastTransactionDate, filterDateString);

      if (!to) {
        to = moment().format('MM/DD/YYYY');
      }

      console.log('/usage cookies:', userCookies.cookies);
      const usage = await presto.getActivityByDateRange(cardNumber, from, to);
      console.log(usage);
      if (usage.status === 'error') {
        throw new Error(usage.message);
      }
      console.log('Checking for duplicates...');

      console.log(`Saving usage to db...`);

      // res.json({ status: 'success', usage: filteredUsage });
      if (lastTransactionDate) {
        usage.transactions.forEach(async item => {
          const transactionDate = await Transaction.findOne({
            where: {
              date: moment(item.date, 'MM/DD/YYYY hh:mm:ss A'),
              cardNumber,
              userId: req.userId
            },
            attributes: ['date']
          });

          if (!transactionDate) {
            console.log('Not dupe:', item);
            item.userId = req.userId;
            transactions = Transaction.create(item);
          }
        });
      } else {
        const updatedUsage = usage.transactions.map(item => {
          item.userId = req.userId;
          return item;
        });
        transactions = await Transaction.bulkCreate(updatedUsage);
      }
    }

    res.json({ status: 'success', data: transactions });
  } catch (error) {
    next(error);
  }
};

module.exports = { login, checkLogin, usage };
