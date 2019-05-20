const express = require('express');
const moment = require('moment');

const Presto = require('../../lib/presto');

const routes = (Transaction, User) => {
  const router = express.Router();

  router.post('/login', async (req, res) => {
    const prestoCredentials = req.body;
    console.log('Logging in!');
    if (!prestoCredentials.username && !prestoCredentials.password) {
      res.sendStatus(500);
      console.log('Invalid request body.');
      return;
    }

    // try {
    if (!req.userId) {
      throw new Error('No user logged in!');
    }

    const presto = new Presto();
    const prestoLoginResp = await presto.login(
      prestoCredentials.username,
      prestoCredentials.password
    );
    const user = await User.findOne({
      where: {
        id: req.userId
      }
    });

    prestoLoginResp.accountInfo = prestoLoginResp.cards;
    console.log(prestoLoginResp);
    // refresh the cards when user logs into presto -- we need to always
    // check this and save, because they may have added a new card since the last time.
    // could add logic to only do this save if the accountInfo differs from last save,
    // but I don't see the point in going that far as yet.
    user.cookies = presto.getCookies();
    user.cards = prestoLoginResp.cards;
    user.save();

    res.json(prestoLoginResp);
    // } catch (error) {
    //   res.send({ error });
    // }
  });

  router.get('/check-login', async (req, res, next) => {
    const presto = new Presto();
    const response = await presto.checkLogin();
    console.log(response);

    if (response.Result === 'success') {
      res.json({ status: 'success', message: 'Logged in to Presto.' });
    } else {
      res.json({ status: 'error', message: 'Not logged in to Presto' });
    }
  });

  router.post('/usage', async (req, res, next) => {
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
  });

  return router;
};

module.exports = routes;
