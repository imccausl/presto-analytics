const express = require('express');
const moment = require('moment');

const { getMonthName } = require('../../lib/util/date');

const types = {
  TRANSIT_FARE: 'Fare Payment',
  TRANSIT_PASS: 'Transit Pass Payment',
  TRANSFER: 'Transfer'
};

const routes = (Transaction, sequelize, Sequelize) => {
  const router = express.Router();

  router.get('/:year/:month', async (req, res, next) => {
    try {
      const searchDateMin = `${req.params.year}-${req.params.month}-01`;
      const searchDateMax =
        req.params.month === '12' ? `${parseInt(req.params.year, 10) + 1}-01-01` : `${req.params.year}-${parseInt(req.params.month, 10) + 1}-01`;

      const transactions = await Transaction.findAll({
        where: {
          userId: req.userId,
          type: Sequelize.or(types.TRANSIT_FARE, types.TRANSIT_PASS, types.TRANSFER),
          date: {
            [Sequelize.Op.gte]: new Date(searchDateMin),
            [Sequelize.Op.lt]: new Date(searchDateMax)
          }
        },
        order: sequelize.literal('date DESC')
      });

      const totalAmount = transactions.reduce((sum, trans) => sum + parseFloat(trans.amount), 0);
      const totalTrips = transactions.length;

      res.json({ status: 'success', data: { transactions, totalTrips, totalAmount } });
    } catch (err) {
      console.error(err.stack);
      next(err);
    }
  });

  router.get('/all', async (req, res, next) => {
    const serializedTransactions = {};

    try {
      const transactions = await Transaction.findAll({
        where: {
          userId: req.userId,
          type: Sequelize.or(types.TRANSIT_FARE, types.TRANSIT_PASS, types.TRANSFER)
        },
        attributes: ['id', 'date', 'agency', 'location', 'type', 'amount'],
        order: sequelize.literal('date DESC')
      });

      transactions.forEach(item => {
        const year = moment(item.date).format('YYYY');
        const month = getMonthName(moment(item.date).month());

        if (serializedTransactions[year]) {
          if (serializedTransactions[year][month]) {
            serializedTransactions[year][month].transactions.push(item);
            serializedTransactions[year][month].amount += parseFloat(item.amount);
          } else {
            serializedTransactions[year][month] = {
              transactions: [item],
              amount: parseFloat(item.amount)
            };
          }
        } else {
          serializedTransactions[year] = {
            [month]: {
              transactions: [item],
              amount: parseFloat(item.amount)
            }
          };
        }
      });

      res.json({ status: 'success', data: serializedTransactions });
    } catch (err) {
      next(err);
    }
  });
  return router;
};

module.exports = routes;
