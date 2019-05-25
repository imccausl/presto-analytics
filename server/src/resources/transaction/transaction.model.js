const Sequelize = require('sequelize');

const types = require('../../../lib/util/types');

function convertToCents(dollars) {
  if (typeof dollars !== 'string') {
    throw new Error(`Invalid input: ${typeof dollars}`);
  }

  return parseInt(parseFloat(dollars) * 100, 10);
}

module.exports = (sequelize, DataTypes) => {
  const transactionModel = sequelize.define('transaction', {
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id'
      },
      field: 'user_id'
    },
    cardNumber: {
      type: DataTypes.STRING,
      field: 'card_number'
    },
    date: {
      type: DataTypes.DATE
    },
    agency: {
      type: DataTypes.STRING
    },
    location: {
      type: DataTypes.STRING
    },
    type: {
      type: DataTypes.STRING
    },
    serviceClass: {
      type: DataTypes.STRING,
      field: 'service_class'
    },
    discount: {
      type: DataTypes.INTEGER,
      set(discount) {
        this.setDataValue('discount', convertToCents(discount));
      }
    },
    amount: {
      type: DataTypes.INTEGER,
      set(amount) {
        this.setDataValue('amount', convertToCents(amount));
      }
    },
    balance: {
      type: DataTypes.INTEGER,
      set(balance) {
        this.setDataValue('balance', convertToCents(balance));
      }
    }
  });

  /**
   * HOOKS
   */

  transactionModel.beforeBulkCreate((records, options) => {
    for (const record of records) {
      record.userId = options.user.id;
    }
  });

  //   transactionModel.beforeCreate((record, options) => {
  //     record.userId = options.user.id;
  //   });

  /**
   * SCOPES
   */

  transactionModel.addScope('currentUser', userId => ({
    where: {
      user_id: userId
    }
  }));

  transactionModel.addScope('transfers', (month, year) => ({
    where: sequelize.and(
      sequelize.where(sequelize.literal(`EXTRACT(YEAR FROM date)`), year),
      sequelize.where(sequelize.literal(`EXTRACT(MONTH FROM date)`), month),
      {
        type: types.TRANSFER
      }
    )
  }));

  transactionModel.addScope('taps', (month, year) => ({
    where: sequelize.and(
      sequelize.where(sequelize.literal(`EXTRACT(YEAR FROM date)`), year),
      sequelize.where(sequelize.literal(`EXTRACT(MONTH FROM date)`), month),
      {
        type: {
          [Sequelize.Op.in]: [types.TRANSIT_FARE, types.TRANSIT_PASS, types.TRANSFER]
        }
      }
    ),
    attributes: ['date', 'agency', 'location', 'type', 'amount', 'balance'],
    order: sequelize.literal('date DESC')
  }));

  transactionModel.addScope('fares', (month, year) => ({
    where: sequelize.and(
      sequelize.where(sequelize.literal(`EXTRACT(YEAR FROM date)`), year),
      sequelize.where(sequelize.literal(`EXTRACT(MONTH FROM date)`), month),
      {
        type: { [Sequelize.Op.in]: [types.TRANSIT_FARE, types.TRANSIT_PASS] }
      }
    )
  }));

  return transactionModel;
};
