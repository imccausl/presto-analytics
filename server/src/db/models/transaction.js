module.exports = (sequelize, DataTypes, UserModel) => {
  const Transaction = sequelize.define('transaction', {
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: UserModel,
        key: 'id'
      }
    },
    cardNumber: {
      type: DataTypes.STRING
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
      type: DataTypes.STRING
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

  Transaction.belongsTo(UserModel, {});

  return Transaction;
};
