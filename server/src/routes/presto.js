const express = require('express');
const moment = require('moment');

const { login, getBasicAccountInfo, getActivityByDateRange } = require('../../lib/presto');

const routes = Transaction => {
  const router = express.Router();

  router.post('/login', async (req, res) => {
    const prestoCredentials = req.body;

    if (!prestoCredentials.username && !prestoCredentials.password) {
      res.sendStatus(500);
      console.log('Invalid request body.');
      return;
    }

    try {
      const prestoLoginResp = await login(prestoCredentials.username, prestoCredentials.password);
      const accountInfo = await getBasicAccountInfo();
      console.log(prestoLoginResp);
      res.send(accountInfo);
    } catch (error) {
      res.send({ error });
    }
  });

  router.post('/usage', async (req, res, next) => {
    try {
      let { from, to } = req.body;
      let filterDateString = '';
      let filteredUsage = [];

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

      const usage = await getActivityByDateRange(from, to);
      filteredUsage = usage;
      // const testUser = await User.findOne({ where: { firstName: 'test' } });
      if (lastTransactionDate) {
        filteredUsage = usage.filter(item => {
          console.log(
            `item: ${item.date}`,
            `lasttransaction: ${filterDateString}`,
            moment(item.date, 'MM/DD/YYYY hh:mm:ss A').isBefore(filterDateString),
            moment(item.date, 'MM/DD/YYYY hh:mm:ss A').isSame(filterDateString)
          );
          return (
            moment(item.date, 'MM/DD/YYYY hh:mm:ss A').isBefore(filterDateString) ||
            !moment(item.date, 'MM/DD/YYYY hh:mm:ss A').isSame(filterDateString)
          );
        });
        console.log('filteredUsage:', filteredUsage);
      }

      console.log(`Getting activity from ${from} to ${to}...`);
      res.send(usage);
      console.log(`Saving usage to db...`);
      filteredUsage.forEach(async transaction => {
        await Transaction.create({
          userId: req.userId,
          date: moment(transaction.date, 'MM/DD/YYYY hh:mm:ss A'),
          agency: transaction.agency,
          location: transaction.location,
          type: transaction.type,
          serviceClass: transaction.serviceClass,
          discount: transaction.discount,
          amount: transaction.amount,
          balance: transaction.balance
        });
      });
    } catch (error) {
      next(error);
    }
  });

  return router;
};

module.exports = routes;
