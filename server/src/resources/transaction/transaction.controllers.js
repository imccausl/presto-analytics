const moment = require('moment');

const { getMonthName } = require('../../../lib/util/date');
const types = require('../../../lib/util/types');
const { db } = require('../../utils/db');
const { transform } = require('./helpers/transforms');

const { sequelize, Sequelize, Transaction } = db;

const monthly = async (req, res, next) => {
  try {
    const { year, month } = req.params;
    const searchDateMin = `${parseInt(month, 10) === 1 ? parseInt(year, 10) - 1 : year}-${
      parseInt(month, 10) === 1 ? '12' : parseInt(month, 10) - 1
    }-01`;

    const searchDateMax =
      month === '12' ? `${parseInt(year, 10) + 1}-01-01` : `${year}-${parseInt(month, 10) + 1}-01`;
    const transactions = await Transaction.findAll({
      where: {
        user_id: req.userId,
        type: Sequelize.or(
          types.TRANSIT_FARE,
          types.TRANSIT_PASS,
          types.TRANSFER,
          types.TRANSIT_PASS_LOAD
        ),
        date: {
          [Sequelize.Op.gte]: new Date(searchDateMin),
          [Sequelize.Op.lt]: new Date(searchDateMax)
        }
      },
      attributes: ['id', 'date', 'agency', 'location', 'type', 'amount', 'balance'],

      order: sequelize.literal('date DESC')
    });

    const transformedData = transform(transactions);
    const totalAmount =
      transformedData[year][getMonthName(month - 1)].amount +
      transformedData[year][getMonthName(month - 1)].transitPassAmount;
    const totalTrips = transformedData[year][getMonthName(month - 1)].transactions.length;
    res.json({
      status: 'success',
      data: {
        transactions: transformedData[year][getMonthName(month - 1)].transactions,
        totalTrips,
        totalAmount
      }
    });
  } catch (err) {
    console.error(err.stack);
    next(err);
  }
};

const all = async (req, res, next) => {
  try {
    if (!req.userId) {
      throw new Error('You must be logged in to access this');
    }

    const transactions = await Transaction.findAll({
      where: {
        user_id: req.userId,
        type: Sequelize.or(
          types.TRANSIT_FARE,
          types.TRANSIT_PASS,
          types.TRANSFER,
          types.TRANSIT_PASS_LOAD
        )
      },
      attributes: ['id', 'date', 'agency', 'location', 'type', 'amount'],
      order: sequelize.literal('date DESC')
    });

    console.log('raw transactions:', transactions);
    const transformedData = transform(transactions);

    res.json({ status: 'success', data: transformedData });
  } catch (err) {
    next(err);
  }
};

const ytdData = async (req, res, next) => {
  try {
    if (!req.userId) {
      throw new Error('You must be logged in to access this');
    }

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
        user_id: req.userId,
        type: Sequelize.or(
          types.TRANSIT_FARE,
          types.TRANSIT_PASS,
          types.TRANSFER,
          types.TRANSIT_PASS_LOAD
        ),
        date: {
          [Sequelize.Op.gte]: moment(yearBefore, 'DD/MM/YYYY'),
          [Sequelize.Op.lte]: moment(today, 'DD/MM/YYYY')
        }
      },
      attributes: ['id', 'date', 'agency', 'location', 'type', 'amount'],
      order: sequelize.literal('date ASC')
    });

    const transformedData = transform(transactions);
    console.log(transformedData);
    res.json({ status: 'success', data: transformedData });
  } catch (error) {
    next(error);
  }
};

const ytd = async (req, res, next) => {
  try {
    const today = moment().format('MM/YYYY');
    const lastYear = moment()
      .subtract(1, 'years')
      .format('MM/YYYY');

    const ytd = await Transaction.findAll({
      where: {
        user_id: req.userId,
        type: sequelize.or(types.TRANSIT_PASS_LOAD, types.TRANSIT_FARE),
        serviceClass: 'Regular',
        date: {
          [Sequelize.Op.gte]: moment(lastYear, 'MM/YYYY'),
          [Sequelize.Op.lt]: moment(today, 'MM/YYYY')
        }
      },
      attributes: [
        'type',
        [sequelize.literal("SUM(CAST(COALESCE(amount, '0') as float))"), 'total'],
        [sequelize.literal('COUNT(type)'), 'count']
      ],
      group: ['type']
    });

    res.json({ status: 'success', data: ytd });
  } catch (error) {
    next({ status: 'error', error });
  }
};

module.exports = { monthly, all, ytdData, ytd };
