const express = require('express');
const moment = require('moment');

const { getMonthName } = require('../../lib/util/date');
const types = require('../../lib/util/types');

function serializeTransactions(transactions) {
  const serializedTransactions = {};

  // serialize the shit out of this data:
  // may be able to do this in a more sql-y way at some point?
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

    // god this is a mess. I apologize to my future self
    // that learns more about sequelize.
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

  return serializedTransactions;
}

const routes = (Transaction, sequelize, Sequelize) => {
  const router = express.Router();

  router.get('/monthly/:year/:month', async (req, res, next) => {
    try {
      const { year, month } = req.params;
      const searchDateMin = `${parseInt(month, 10) === 1 ? parseInt(year, 10) - 1 : year}-${
        parseInt(month, 10) === 1 ? '12' : parseInt(month, 10) - 1
      }-01`;
      const searchDateMax = month === '12' ? `${parseInt(year, 10) + 1}-01-01` : `${year}-${parseInt(month, 10) + 1}-01`;
      const transactions = await Transaction.findAll({
        where: {
          userId: req.userId,
          type: Sequelize.or(types.TRANSIT_FARE, types.TRANSIT_PASS, types.TRANSFER, types.TRANSIT_PASS_LOAD),
          date: {
            [Sequelize.Op.gte]: new Date(searchDateMin),
            [Sequelize.Op.lt]: new Date(searchDateMax)
          }
        },
        attributes: ['id', 'date', 'agency', 'location', 'type', 'amount', 'balance'],

        order: sequelize.literal('date DESC')
      });

      const serializedTransactions = serializeTransactions(transactions);
      const totalAmount =
        serializedTransactions[year][getMonthName(month - 1)].amount + serializedTransactions[year][getMonthName(month - 1)].transitPassAmount;
      const totalTrips = serializedTransactions[year][getMonthName(month - 1)].transactions.length;
      res.json({
        status: 'success',
        data: { transactions: serializedTransactions[year][getMonthName(month - 1)].transactions, totalTrips, totalAmount }
      });
    } catch (err) {
      console.error(err.stack);
      next(err);
    }
  });

  router.get('/all', async (req, res, next) => {
    try {
      const transactions = await Transaction.findAll({
        where: {
          userId: req.userId,
          type: Sequelize.or(types.TRANSIT_FARE, types.TRANSIT_PASS, types.TRANSFER, types.TRANSIT_PASS_LOAD)
        },
        attributes: ['id', 'date', 'agency', 'location', 'type', 'amount'],
        order: sequelize.literal('date DESC')
      });

      const serializedTransactions = serializeTransactions(transactions);

      res.json({ status: 'success', data: serializedTransactions });
    } catch (err) {
      next(err);
    }
  });

  router.get('/ytd/data', async (req, res, next) => {
    try {
      const today = moment()
        .endOf('month')
        .format('DD/MM/YYYY');
      const yearBefore = moment()
        .subtract(1, 'years')
        .startOf('month')
        .format('DD/MM/YYYY');

      console.log(today, yearBefore);
      const transactions = await Transaction.findAll({
        where: {
          userId: req.userId,
          type: Sequelize.or(types.TRANSIT_FARE, types.TRANSIT_PASS, types.TRANSFER, types.TRANSIT_PASS_LOAD),
          date: {
            [Sequelize.Op.gte]: moment(yearBefore, 'DD/MM/YYYY'),
            [Sequelize.Op.lte]: moment(today, 'DD/MM/YYYY')
          }
        },
        attributes: ['id', 'date', 'agency', 'location', 'type', 'amount'],
        order: sequelize.literal('date ASC')
      });

      const serializedTransactions = serializeTransactions(transactions);
      console.log(serializedTransactions);
      res.json({ status: 'success', data: serializedTransactions });
    } catch (error) {
      next({ status: 'error', error });
    }
  });

  router.get('/ytd', async (req, res, next) => {
    try {
      const today = moment().format('MM/YYYY');
      const lastYear = moment()
        .subtract(1, 'years')
        .format('MM/YYYY');

      const ytd = await Transaction.findAll({
        where: {
          userId: req.userId,
          type: sequelize.or(types.TRANSIT_PASS_LOAD, types.TRANSIT_FARE),
          serviceClass: 'Regular',
          date: {
            [Sequelize.Op.gte]: moment(lastYear, 'MM/YYYY'),
            [Sequelize.Op.lt]: moment(today, 'MM/YYYY')
          }
        },
        attributes: ['type', [sequelize.literal("SUM(CAST(COALESCE(amount, '0') as float))"), 'total'], [sequelize.literal('COUNT(type)'), 'count']],
        group: ['type']
      });

      res.json({ status: 'success', data: ytd });
    } catch (error) {
      next({ status: 'error', error });
    }
  });

  return router;
};

module.exports = routes;
