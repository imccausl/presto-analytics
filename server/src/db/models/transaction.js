module.exports = (sequelize, DataTypes, UserModel) =>
  sequelize.define('transaction', {
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: UserModel,
        key: 'id'
      }
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
