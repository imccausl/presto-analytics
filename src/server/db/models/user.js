const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  // const permissions = DataTypes.ENUM('ADMIN', 'USER');

  const User = sequelize.define('user', {
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

  User.beforeCreate(async user => {
    try {
      const hashedPass = await bcrypt.hash(user.password, 10);
      user.password = hashedPass; // eslint-disable-line
      return user;
    } catch (err) {
      console.log(err);
      return err;
    }
  });

  User.prototype.validatePassword = async function validatePassword(password) {
    return bcrypt.compare(password, this.password);
  };

  return User;
};
