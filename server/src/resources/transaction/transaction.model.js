function convertToCents(dollars) {
  if (typeof dollars !== 'string' || typeof dollars !== 'number') {
    throw new Error(`Invalid input: ${typeof dollars}`);
  }

  return parseInt(parseFloat(dollars) * 100, 10);
}

module.exports = (sequelize, DataTypes) => {
  const transactionModel = sequelize.define('Transaction', {
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
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
        convertToCents(discount);
      }
    },
    amount: {
      type: DataTypes.INTEGER,
      set(amount) {
        convertToCents(amount);
      }
    },
    balance: {
      type: DataTypes.INTEGER,
      set(balance) {
        convertToCents(balance);
      }
    }
  });
};
