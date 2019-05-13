const express = require('express');
const moment = require('moment');

const {
  login,
  getBasicAccountInfo,
  isLoggedIn,
  getActivityByDateRange
} = require('../../lib/presto');

const routes = (Transaction, User, sequelize, Sequelize) => {
  const router = express.Router();

  router.post('/login', async (req, res) => {
    const prestoCredentials = req.body;
    console.log('Logging in!');
    if (!prestoCredentials.username && !prestoCredentials.password) {
      res.sendStatus(500);
      console.log('Invalid request body.');
      return;
    }

    try {
      if (!req.userId) {
        throw new Error('No user logged in!');
      }

      const prestoLoginResp = await login(prestoCredentials.username, prestoCredentials.password);
      const accountInfo = await getBasicAccountInfo();
      const user = await User.findOne({
        where: {
          id: req.userId
        }
      });

      prestoLoginResp.accountInfo = accountInfo;
      console.log(prestoLoginResp);
      // refresh the cards when user logs into presto -- we need to always
      // check this and save, because they may have added a new card since the last time.
      // could add logic to only do this save if the accountInfo differs from last save,
      // but I don't see the point in going that far as yet.
      user.cards = accountInfo;
      user.save();

      res.json(prestoLoginResp);
    } catch (error) {
      res.send({ error });
    }
  });

  router.get('/check-login', async (req, res, next) => {
    const response = await isLoggedIn();
    console.log(response);

    if (response === 'true') {
      res.json({ status: 'success', message: 'Logged in to Presto.' });
    } else {
      res.json({ status: 'error', message: 'Not logged in to Presto' });
    }
  });

  router.post('/usage', async (req, res, next) => {
    // try {
    const { from, to } = req.body;
    const filterDateString = '';
    const transactions = [];

    const filteredUsage = [];
    const cards = req.body.cards.split(',') || [];

    if (!req.userId) {
      throw new Error('No user logged in!');
    }

    console.log('Getting from card number(s): ', cards);

    const eachCardLastTransaction = await Transaction.findAll({
      attributes: [
        'cardNumber',
        [sequelize.fn('MAX', sequelize.col('date')), 'lastTransactionDate']
      ],
      where: {
        userId: req.userId,
        cardNumber: {
          [Sequelize.Op.in]: cards
        }
      },
      group: ['cardNumber']
    });

    // convert the dates using moment
    // and create an array with the essential pieces necessary for the next query?
    // Wondering how necessary it is to loop through everything here
    // instead of just working with the eachCardLastTransaction object directly.
    //
    // For some reason the [sequelize.fn('MAX', ...), 'lastTransactionDate'], above with the lastTransactionDate alias
    // is returning undefined when trying to access the lastTransactionDate attribute. This
    // super hacky JSON.parse(JSON.stringify()) seems to fix the issue. I'll look into how to actually
    // fix this later.
    const lastTransactionDates = JSON.parse(JSON.stringify(eachCardLastTransaction)).map(row => ({
      cardNumber: row.cardNumber,
      lastTransactionDate: row.lastTransactionDate
        ? moment(row.lastTransactionDate).format('MM/DD/YYYY')
        : moment(from).format('MM/DD/YYYY'),
      filterDateString: moment(row.lastTransactionDate).format('MM/DD/YYYY hh:mm:ss A'),
      toDate: to ? moment(to).format('MM/DD/YYYY') : moment().format('MM/DD/YYYY')
    }));

    console.log('lastTransactionDates with time formatting:', JSON.stringify(lastTransactionDates));

    const promiseArray = lastTransactionDates.map(card => () =>
      getActivityByDateRange(card.lastTransactionDate, card.toDate, card.cardNumber)
    );

    // I cannot figure out any better way to run these promises serially.
    // They have to be run serially because the correct data being returned
    // depends on the state of the DOM set by the setCard() function in the
    // the Presto API util. If the promises are run in parallel, getActivityByDateRange()
    // ends up performing all card transaction lookups on the same set of Data (the last DOM state set by setCard).
    const resolvedActivityObject = {};

    for (let i = 0; i < promiseArray.length; i += 1) {
      Object.assign(resolvedActivityObject, await promiseArray[i]());
    }

    console.log('resolvedActivityObject:', JSON.stringify(resolvedActivityObject));

    let filteredActivity = [];

    lastTransactionDates.forEach(card => {
      filteredActivity = resolvedActivityObject[card.cardNumber].filter(item => {
        console.log(moment(item.date).format('MM/DD/YYYY hh:mm:ss A') > card.filterDateString);
        console.log(moment(item.date).format('MM/DD/YYYY hh:mm:ss A'));
        console.log(card.filterDateString);
        return moment(item.date).format('MM/DD/YYYY hh:mm:ss A') > card.filterDateString;
      });
    });

    console.log('filteredActivity:', filteredActivity);

    // worst case scenerio the lastTransactionDates array is an array of essentially empty objects
    // so this check won't work.
    // if (lastTransactionDates.length > 0) {
    //   // this path: there are last transaction date so check for dups
    //   const resolvedPreviousDataArray = await Promise.all(
    //     lastTransactionDates.map(async card => {
    //       const possibleDuplicateTransactions = await Transaction.findAll({
    //         where: {
    //           date: moment(card.lastTransactionDate).format('MM/DD/YYY'),
    //           cardNumber: card.cardNumber,
    //           userId: req.userId
    //         },
    //         attributes: ['date']
    //       });

    //       return { cardNumber: card.cardNumber, possibleDuplicateTransactions };
    //     })
    //   );

    //   console.log(resolvedPreviousDataArray);
    // } else {
    //   // this path: no last transactions; write everything to the db
    // }

    // // res.json({ status: 'success', usage: filteredUsage });
    // if (lastTransactionDate) {
    //   usage.transactions.forEach(async item => {
    //     const transactionDate = await Transaction.findOne({
    //       where: {
    //         date: moment(item.date, 'MM/DD/YYYY hh:mm:ss A'),
    //         cardNumber: {
    //           [Sequelize.Op.in]: cards
    //         },
    //         userId: req.userId
    //       },
    //       attributes: ['date']
    //     });

    //     if (!transactionDate) {
    //       console.log('Not dupe:', item);
    //       item.userId = req.userId;
    //       transactions = Transaction.create(item);
    //     }
    //   });
    // } else {
    //   const updatedUsage = usage.transactions.map(item => {
    //     item.userId = req.userId;
    //     return item;
    //   });
    //   transactions = await Transaction.bulkCreate(updatedUsage);
    // }

    res.json({ status: 'success', data: transactions });
    // } catch (error) {
    //   next(error);
    // }
  });

  return router;
};

module.exports = routes;
