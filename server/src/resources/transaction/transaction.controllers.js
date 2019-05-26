const moment = require('moment');

const { successResponse } = require('../../utils/response');
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

    const payload = {
      transactions,
      count: {
        fares,
        transfers
      },
      totalAmount
    };

    res.json(successResponse(payload));
  } catch (err) {
    console.error(err.stack);
    next(err);
  }
};

const getAll = async (req, res, next) => {
  const { user } = req;

  try {
    const Taps = Transaction.scope(
      {
        method: ['currentUser', user.id]
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

    // const transformedData = transform(transactions);

    res.json(successResponse(transactions));
  } catch (err) {
    next(err);
  }
};

const postAll = async (req, res, next) => {
  try {
    const transactions = req.body;
    const { user } = req;
    const transactionsToJSON =
      typeof transactions === 'string' ? JSON.parse(transactions) : transactions;

    const create = await Transaction.bulkCreate(transactionsToJSON, {
      user,
      ignoreDuplicates: true
    });

    res.json(successResponse(create));
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const deleteAll = async (req, res, next) => {
  try {
    const { user } = req;
    const Transactions = Transaction.scope({
      method: ['currentUser', user.id]
    });

    const destroy = await Transactions.destroy();

    res.json(successResponse(destroy));
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const ytdData = async (req, res, next) => {
  try {
    const today = moment()
      .endOf('month')
      .format('DD/MM/YYYY');
    const yearBefore = moment()
      .subtract(1, 'years')
      .startOf('month')
      .format('DD/MM/YYYY');

    const YTDFares = Transaction.scope(
      {
        method: ['currentUser', req.userId]
      },
      {
        method: ['dateRange', moment(yearBefore, 'DD/MM/YYYY'), moment(today, 'DD/MM/YYYY')]
      },
      {
        method: [
          'types',
          [types.TRANSIT_FARE, types.TRANSIT_PASS, types.TRANSFER, types.TRANSIT_PASS_LOAD]
        ]
      }
    );

    const transactions = await YTDFares.findAll({
      order: sequelize.literal('date ASC')
    });

    const transformedData = transform(transactions);

    res.json(successResponse(transformedData));
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

    res.json(successResponse(ytd));
  } catch (error) {
    next({ status: 'error', error });
  }
};

module.exports = { postAll, getAll, deleteAll, monthly, ytdData, ytd };
