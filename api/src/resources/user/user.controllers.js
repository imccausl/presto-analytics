require('dotenv').config({ path: '../../../.env' });

const jwt = require('jsonwebtoken');
const moment = require('moment');

const types = require('../../../lib/util/types');
const { db } = require('../../utils/db');

const { sequelize, Sequelize, User, Transaction, Budget } = db;

const me = async (req, res, next) => {
  const user = await User.findOne({
    where: {
      id: req.userId
    },
    attributes: ['id', 'firstName', 'lastName', 'email', 'cards', 'permissions']
  });

  const balance = user.cards.reduce((sum, curr) => {
    const amount = parseFloat(
      // make it a negative number if there are brackets around it.
      curr.balance
        .replace('$', '')
        .replace('(', '-')
        .replace(')', '')
    );

    return sum + amount;
  }, 0);

  const budget = await Budget.findOne({
    where: {
      userId: req.userId
    }
  });

  const UserTransactions = Transaction.scope({
    method: ['currentUser', req.userId]
  });

  const Taps = Transaction.scope(
    {
      method: ['currentUser', req.userId]
    },
    {
      method: ['types', [types.TRANSIT_FARE, types.TRANSIT_PASS, types.TRANSFER]]
    }
  );

  const lastActivity = await Taps.findAll({
    order: sequelize.literal('date DESC'),
    limit: 1
  });

  const totalSpent = await UserTransactions.sum('amount', {
    where: { type: { [Sequelize.Op.like]: '%Payment By%' } }
  });

  const firstActivityDate = await UserTransactions.min('date');

  // console.log(process.env.TEST_USERNAME, process.env.TEST_PASSWORD);
  // const loginStatus = await login(process.env.TEST_USERNAME, process.env.TEST_PASSWORD);
  // console.log(loginStatus);

  // if (loginStatus.success) {
  //   accountInfo = await getBasicAccountInfo();
  // }

  // user.cards = accountInfo || [{ cardNumber: '', balance: '0.00' }];
  // await user.save();

  console.log(`** User ${user.firstName} logged in!`);

  res.json({
    status: 'success',
    data: {
      user,
      balance,
      budget,
      lastActivity,
      spent: {
        amount: totalSpent,
        since: firstActivityDate
      }
    }
  });
};

const deleteOwnAccount = async (req, res, next) => {
  const { verify } = req.body;
  // for now, only let users delete their own accounts
  if (verify !== 'yes') {
    throw new Error('This action was not verified and could not be completed.');
  }

  // delete user
  try {
    const deletedUser = await User.destroy({
      where: {
        id: req.userId
      }
    });

    // remove auth token (cookie) and prestoAuth stuff
    res.clearCookie('auth');
    res.clearCookie('prestoAuth');

    res.json({
      status: 'success',
      message: `Deleted user with ID: ${req.userId}`,
      data: deletedUser
    });
  } catch (e) {
    next(e);
  }
};

const changeDetails = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { firstName, lastName, email } = req.body;

    if (userId !== req.userId.toString()) {
      throw new Error('You do not have permission to do this.');
    }

    const user = await User.findOne({
      where: {
        id: req.userId
      },
      attributes: ['id', 'firstName', 'lastName', 'email']
    });

    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;

    user.save();

    res.send({
      status: 'success',
      message: `Details changed for user with ID: ${req.userId}`,
      data: { firstName, lastName, email }
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { me, deleteOwnAccount, changeDetails };
