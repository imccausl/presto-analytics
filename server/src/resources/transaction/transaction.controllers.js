const moment = require('moment');

const { successResponse } = require('../../utils/response');
const types = require('../../../lib/util/types');
const { db } = require('../../utils/db');
const { transform } = require('./helpers/transforms');

const { sequelize, Sequelize, Transaction } = db;

function calculateLastMonth(month, year) {
  let parsedYear = parseInt(year, 10);
  let parsedMonth = parseInt(month, 10);

  if (parsedMonth === 1) {
    parsedYear = year - 1;
    parsedMonth = 12;

    return { year: parsedYear, month: parsedMonth };
  }

  return { year: parsedYear, month: parsedMonth - 1 };
}

const monthly = async (req, res, next) => {
  try {
    const { year, month, cardNumber } = req.params;

    const lastMonth = calculateLastMonth(month, year);

    // 1. get current data
    const Transfers = Transaction.scope(
      {
        method: ['types', [types.TRANSFER]]
      },
      {
        method: ['yearAndMonth', parseInt(year, 10), parseInt(month, 10)]
      },
      {
        method: ['cardNumber', cardNumber]
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
        method: ['cardNumber', cardNumber]
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
        method: ['cardNumber', cardNumber]
      },
      {
        method: ['types', [types.TRANSIT_FARE, types.TRANSIT_PASS]]
      }
    );

    const fares = await Fares.count();
    const transfers = await Transfers.count();
    const transactions = await Taps.findAll({ order: sequelize.literal('date ASC') });
    const totalAmount = await Fares.sum('amount');

    // 2. get last month for comparison
    const LastMonthTransfers = Transaction.scope(
      {
        method: ['types', [types.TRANSFER]]
      },
      {
        method: ['yearAndMonth', lastMonth.year, lastMonth.month]
      },
      {
        method: ['cardNumber', cardNumber]
      },
      {
        method: ['currentUser', req.userId]
      }
    );
    const LastMonthTaps = Transaction.scope(
      {
        method: ['currentUser', req.userId]
      },
      {
        method: ['yearAndMonth', lastMonth.year, lastMonth.month]
      },
      {
        method: ['cardNumber', cardNumber]
      },
      {
        method: ['types', [types.TRANSIT_FARE, types.TRANSIT_PASS, types.TRANSFER]]
      }
    );
    const LastMonthFares = Transaction.scope(
      {
        method: ['currentUser', req.userId]
      },
      {
        method: ['yearAndMonth', lastMonth.year, lastMonth.month]
      },
      {
        method: ['cardNumber', cardNumber]
      },
      {
        method: ['types', [types.TRANSIT_FARE, types.TRANSIT_PASS]]
      }
    );

    const lastMonthFares = await LastMonthFares.count();
    const lastMonthTransfers = await LastMonthTransfers.count();
    const lastMonthTransactions = await LastMonthTaps.findAll({
      order: sequelize.literal('date ASC')
    });
    const lastMonthTotalAmount = await LastMonthFares.sum('amount');

    // 3. get last year for comparison
    const LastYearTransfers = Transaction.scope(
      {
        method: ['types', [types.TRANSFER]]
      },
      {
        method: ['yearAndMonth', parseInt(year, 10) - 1, parseInt(month, 10)]
      },
      {
        method: ['cardNumber', cardNumber]
      },
      {
        method: ['currentUser', req.userId]
      }
    );
    const LastYearTaps = Transaction.scope(
      {
        method: ['currentUser', req.userId]
      },
      {
        method: ['yearAndMonth', parseInt(year, 10) - 1, parseInt(month, 10)]
      },
      {
        method: ['cardNumber', cardNumber]
      },
      {
        method: ['types', [types.TRANSIT_FARE, types.TRANSIT_PASS, types.TRANSFER]]
      }
    );
    const LastYearFares = Transaction.scope(
      {
        method: ['currentUser', req.userId]
      },
      {
        method: ['yearAndMonth', parseInt(year, 10) - 1, parseInt(month, 10)]
      },
      {
        method: ['cardNumber', cardNumber]
      },
      {
        method: ['types', [types.TRANSIT_FARE, types.TRANSIT_PASS]]
      }
    );

    const lastYearFares = await LastYearFares.count();
    const lastYearTransfers = await LastYearTransfers.count();
    const lastYearTransactions = await LastYearTaps.findAll({
      order: sequelize.literal('date ASC')
    });
    const lastYearTotalAmount = await LastYearFares.sum('amount');

    const payload = {
      transactions,
      count: {
        fares,
        transfers
      },
      totalAmount,
      prevInterval: {
        transactions: lastMonthTransactions,
        count: {
          fares: lastMonthFares,
          transfers: lastMonthTransfers
        },
        totalAmount: lastMonthTotalAmount
      },
      lastYear: {
        transactions: lastYearTransactions,
        count: {
          fares: lastYearFares,
          transfers: lastYearTransfers
        },
        totalAmount: lastYearTotalAmount
      }
    };

    res.json(successResponse(payload));
  } catch (err) {
    console.error(err.stack);
    next(err);
  }
};

const range = async (req, res, next) => {
  try {
    const { days } = req.query;
    const { cardNumber } = req.params;
    const startOfPreviousInterval = moment()
      .subtract(parseInt(days, 10), 'days')
      .format('DD-MM-YYYY');
    console.log('prevInterval:', days, startOfPreviousInterval);

    const Transfers = Transaction.scope(
      {
        method: ['types', [types.TRANSFER]]
      },
      {
        method: ['cardNumber', cardNumber]
      },
      {
        method: ['interval', parseInt(days, 10)]
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
        method: ['cardNumber', cardNumber]
      },
      {
        method: ['interval', parseInt(days, 10)]
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
        method: ['cardNumber', cardNumber]
      },
      {
        method: ['interval', parseInt(days, 10)]
      },
      {
        method: ['types', [types.TRANSIT_FARE, types.TRANSIT_PASS]]
      }
    );

    const fares = await Fares.count();
    const transfers = await Transfers.count();
    const transactions = await Taps.findAll({ order: sequelize.literal('date ASC') });
    const totalAmount = await Fares.sum('amount');

    // get amounts from previous interval for comparison
    const PrevIntervalTransfers = Transaction.scope(
      {
        method: ['types', [types.TRANSFER]]
      },
      {
        method: ['cardNumber', cardNumber]
      },
      {
        method: ['interval', parseInt(days, 10), startOfPreviousInterval]
      },
      {
        method: ['currentUser', req.userId]
      }
    );
    const PrevIntervalTaps = Transaction.scope(
      {
        method: ['currentUser', req.userId]
      },
      {
        method: ['cardNumber', cardNumber]
      },
      {
        method: ['interval', parseInt(days, 10), startOfPreviousInterval]
      },
      {
        method: ['types', [types.TRANSIT_FARE, types.TRANSIT_PASS, types.TRANSFER]]
      }
    );
    const PrevIntervalFares = Transaction.scope(
      {
        method: ['currentUser', req.userId]
      },
      {
        method: ['cardNumber', cardNumber]
      },
      {
        method: ['interval', parseInt(days, 10), startOfPreviousInterval]
      },
      {
        method: ['types', [types.TRANSIT_FARE, types.TRANSIT_PASS]]
      }
    );

    const prevIntervalFares = await PrevIntervalFares.count();
    const prevIntervalTransfers = await PrevIntervalTransfers.count();
    const prevIntervalTransactions = await PrevIntervalTaps.findAll({
      order: sequelize.literal('date ASC')
    });
    const prevIntervalTotalAmount = await PrevIntervalFares.sum('amount');

    const payload = {
      transactions,
      count: {
        fares,
        transfers
      },
      totalAmount,
      prevInterval: {
        transactions: prevIntervalTransactions,
        count: {
          fares: prevIntervalFares,
          transfers: prevIntervalTransfers
        },
        totalAmount: prevIntervalTotalAmount
      }
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

    const transformedData = transform(transactions);

    res.json(successResponse(transformedData));
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

module.exports = { postAll, getAll, deleteAll, monthly, ytdData, ytd, range };
