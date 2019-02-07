const express = require('express');
const moment = require('moment');

const { login, getBasicAccountInfo, isLoggedIn, getActivityByDateRange } = require('../../lib/presto');

const routes = Transaction => {
  const router = express.Router();

  router.post('/login', async (req, res) => {
    const prestoCredentials = req.body;
    console.log(req.body);
    if (!prestoCredentials.username && !prestoCredentials.password) {
      res.sendStatus(500);
      console.log('Invalid request body.');
      return;
    }

    try {
      const prestoLoginResp = await login(prestoCredentials.username, prestoCredentials.password);
      const accountInfo = await getBasicAccountInfo();
      prestoLoginResp.accountInfo = accountInfo;

      console.log(prestoLoginResp);
      res.json(prestoLoginResp);
    } catch (error) {
      res.send({ error });
    }
  });

  router.get('/check-login', async (req, res, next) => {
    const response = await isLoggedIn();

    if (response === 'true') {
      res.json({ status: 'success', message: 'Logged in to Presto.' });
    } else {
      res.json({ status: 'error', message: 'Not logged in to Presto' });
    }
  });

  router.post('/usage', async (req, res, next) => {
    try {
      let { from, to, cardNumber } = req.body;
      let filterDateString = '';
      let transactions = [];
      const filteredUsage = [];

      if (!req.userId) {
        throw new Error('No user logged in!');
      }

      const lastTransactionDate = await Transaction.max('date', {
        where: {
          userId: req.userId
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

      const usage = await getActivityByDateRange(from, to, cardNumber);
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

      res.json({ status: 'success', data: transactions });
    } catch (error) {
      next(error);
    }
  });

  return router;
};

module.exports = routes;
