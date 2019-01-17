const express = require('express');
const moment = require('moment');

const { getMonthName } = require('../../lib/util/date');

const types = {
  TRANSIT_PASS_LOAD: 'Load Transit Pass',
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
          type: Sequelize.or(types.TRANSIT_FARE, types.TRANSIT_PASS, types.TRANSFER, types.TRANSIT_PASS_LOAD)
        },
        attributes: ['id', 'date', 'agency', 'location', 'type', 'amount'],
        order: sequelize.literal('date DESC')
      });

      transactions.forEach(item => {
        const itemDate = new Date(item.date);
        const monthNum = moment(itemDate).format('M');
        const transitPassPurchasePeriod =
          moment(itemDate)
            .endOf('month')
            .diff(itemDate, 'days') <= 8;

        let year = moment(itemDate).format('YYYY');
        let month = getMonthName(moment(itemDate).month());

        // if a transit pass was purchaseed 8 days before the end of the month,
        // move it to the next month because it was for that month that it was
        // purchased.

        if (item.type === types.TRANSIT_PASS_LOAD && transitPassPurchasePeriod) {
          const addMonth = moment(itemDate, 'M').add(1, 'months');
          if (monthNum === 12) {
            year += 1;
          }

          month = getMonthName(moment(addMonth).month());
        }

        if (serializedTransactions[year]) {
          if (serializedTransactions[year][month]) {
            if (item.type !== types.TRANSIT_PASS_LOAD) {
              serializedTransactions[year][month].transactions.push(item);
              serializedTransactions[year][month].amount += parseFloat(item.amount);
            } else {
              serializedTransactions[year][month].transitPassAmount += parseFloat(item.amount);
            }
          } else {
            serializedTransactions[year][month] = {
              transactions: item.type === types.TRANSIT_PASS_LOAD ? [] : [item],
              amount: item.type === types.TRANSIT_PASS_LOAD ? 0 : parseFloat(item.amount),
              transitPassAmount: item.type === types.TRANSIT_PASS_LOAD ? parseFloat(item.amount) : 0
            };
          }
        } else {
          serializedTransactions[year] = {
            [month]: {
              transactions: item.type === types.TRANSIT_PASS_LOAD ? [] : [item],
              amount: item.type === types.TRANSIT_PASS_LOAD ? 0 : parseFloat(item.amount),
              transitPassAmount: item.type === types.TRANSIT_PASS_LOAD ? parseFloat(item.amount) : 0
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
