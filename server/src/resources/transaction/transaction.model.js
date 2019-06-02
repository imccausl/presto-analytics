const Sequelize = require('sequelize');

function convertToCents(dollars) {
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

  transactionModel.beforeBulkCreate(async (records, options) => {
    for (const record of records) {
      record.userId = options.user.id;
      const dup = await transactionModel.findOne({
        where: {
          date: record.date,
          userId: options.user.id
        }
      });

      if (dup) {
        record.id = dup.id;
      }
    }
  });

  /**
   * SCOPES
   */

  transactionModel.addScope('currentUser', userId => ({
    where: {
      userId
    }
  }));

  transactionModel.addScope('yearAndMonth', (year, month) => ({
    where: sequelize.and(
      sequelize.where(sequelize.literal(`EXTRACT(YEAR FROM date)`), year),
      sequelize.where(sequelize.literal(`EXTRACT(MONTH FROM date)`), month)
    )
  }));

  transactionModel.addScope('dateRange', (from, to) => ({
    where: {
      date: {
        [Sequelize.Op.gte]: from,
        [Sequelize.Op.lte]: to
      }
    }
  }));

  transactionModel.addScope('interval', interval => ({
    where: {
      date: {
        [Sequelize.Op.gte]: sequelize.literal(`NOW() - INTERVAL '${interval} days'`)
      }
    }
  }));

  transactionModel.addScope('cardNumber', cardNumber => {
    if (cardNumber === 'all') {
      return {};
    }

    return {
      where: {
        cardNumber
      }
    };
  });

  transactionModel.addScope('types', types => ({
    where: {
      type: {
        [Sequelize.Op.in]: types
      }
    }
  }));

  return transactionModel;
};
