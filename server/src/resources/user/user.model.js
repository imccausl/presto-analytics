const bcrypt = require('bcryptjs');
const { DataTypes } = require('sequelize');

const { sequelize } = require('../../utils/db');

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
  cards: {
    type: DataTypes.TEXT,
    allowNull: false,
    get() {
      return JSON.parse(this.getDataValue('cards'));
    },
    set(cards) {
      this.setDataValue('cards', JSON.stringify(cards));
    }
  },
  permission: {
    type: DataTypes.ARRAY(DataTypes.TEXT)
  },
  cookies: {
    type: DataTypes.TEXT,
    allowNull: true,
    // get() {
    //   return tough.toJSON(this.getDataValue('cookies'));
    // },
    set(cookies) {
      this.setDataValue('cookies', JSON.stringify(cookies));
    }
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

module.exports = User;
