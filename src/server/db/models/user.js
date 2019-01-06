module.exports = (sequelize, DataTypes) =>
  // const permissions = DataTypes.ENUM('ADMIN', 'USER');

  sequelize.define('user', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    permission: {
      type: DataTypes.ARRAY(DataTypes.TEXT)
    }
  });
