module.exports = (sequelize, DataTypes, UserModel) => {
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

  return Budget;
};
