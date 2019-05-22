module.exports = (sequelize, DataTypes) => {
  const budgetModel = sequelize.define('Budget', {
    agency: {
      type: DataTypes.STRING
    },
    monthlyPassCost: {
      type: DataTypes.STRING,
      field: 'monthly_pass_cost'
    },
    fareCost: {
      type: DataTypes.STRING,
      field: 'fare_cost'
    }
  });

  budgetModel.associate = models => {
    budgetModel.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
  };

  return budgetModel;
};
