const moment = require('moment');

const { getMonthName } = require('../../../lib/util/date');
const types = require('../../../lib/util/types');
const { db } = require('../../utils/db');
const { transform } = require('./helpers/transforms');

const { sequelize, Sequelize, Transaction } = db;

const monthly = async (req, res, next) => {
  try {
    const { year, month } = req.params;

    const Transfers = Transaction.scope(
      {
        method: ['types', [types.TRANSFER]]
      },
      {
        method: ['yearAndMonth', parseInt(year, 10), parseInt(month, 10)]
      },
      {
        method: ['currentUser', req.userId]
      }
    );
    const Taps = Transaction.scope(
      {
        method: ['currentUser', req.userId]
      },
      {
        method: ['yearAndMonth', parseInt(year, 10), parseInt(month, 10)]
      },
      {
        method: ['types', [types.TRANSIT_FARE, types.TRANSIT_PASS, types.TRANSFER]]
      }
    );
    const Fares = Transaction.scope(
      {
        method: ['currentUser', req.userId]
      },
      {
        method: ['yearAndMonth', parseInt(year, 10), parseInt(month, 10)]
      },
      {
        method: ['types', [types.TRANSIT_FARE, types.TRANSIT_PASS]]
      }
    );

    const fares = await Fares.count();
    const transfers = await Transfers.count();
    const transactions = await Taps.findAll({ order: sequelize.literal('date DESC') });
    const totalAmount = await Fares.sum('amount');

    res.json({
      status: 'success',
      data: {
        transactions,
        count: {
          fares,
          transfers
        },
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
    const Taps = Transaction.scope(
      {
        method: ['currentUser', req.userId]
      },
      {
        method: [
          'types',
          [types.TRANSIT_FARE, types.TRANSIT_PASS, types.TRANSFER, types.TRANSIT_PASS_LOAD]
        ]
      }
    );

    const transactions = await Taps.findAll({
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
        userId: req.userId,
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
        userId: req.userId,
        type: sequelize.or(types.TRANSIT_PASS_LOAD, types.TRANSIT_FARE),
        serviceClass: 'Regular',
        date: {
          [Sequelize.Op.gte]: moment(lastYear, 'MM/YYYY'),
          [Sequelize.Op.lt]: moment(today, 'MM/YYYY')
        }
      },
      attributes: [
        'type',
        [sequelize.literal("SUM(COALESCE(amount, '0'))"), 'total'],
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
