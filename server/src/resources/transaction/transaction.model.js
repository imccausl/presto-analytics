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
      type: DataTypes.STRING
    },
    amount: {
      type: DataTypes.STRING
    },
    balance: {
      type: DataTypes.STRING
    }
  });

  return transactionModel;
};