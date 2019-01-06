module.exports = (sequelize, DataTypes) =>
  sequelize.define('prestoUsage', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    firstName: {
      type: DataTypes.STRING
    },
    lastName: {
      type: DataTypes.STRING
    },
    password: {
      type: DataTypes.STRING
    },
    email: {
      type: DataTypes.STRING
    }
  });
