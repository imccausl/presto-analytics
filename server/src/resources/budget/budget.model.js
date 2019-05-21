module.exports = (sequelize, DataTypes) => {
  const budgetModel = sequelize.define('budget', {
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'user',
        key: 'id'
      },
      field: 'user_id'
    },
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
    budgetModel.belongsTo(models.user, { foreignKey: 'id', as: 'user' });
  };

  return budgetModel;
};
