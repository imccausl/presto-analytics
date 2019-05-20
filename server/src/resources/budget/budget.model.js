const { DataTypes } = require('sequelize');

const { sequelize } = require('../../utils/db');
const UserModel = require('../user/user.model');

const Budget = sequelize.define('budget', {
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: UserModel,
      key: 'id'
    }
  },
  agency: {
    type: DataTypes.STRING
  },
  monthlyPassCost: {
    type: DataTypes.STRING
  },
  fareCost: {
    type: DataTypes.STRING
  }
});

Budget.belongsTo(UserModel, {});

module.exports = Budget;
