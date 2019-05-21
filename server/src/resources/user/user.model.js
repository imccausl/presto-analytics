const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  const userModel = sequelize.define('user', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'first_name'
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'last_name'
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

      set(cookies) {
        this.setDataValue('cookies', JSON.stringify(cookies));
      }
    }
  });

  userModel.beforeCreate(async user => {
    try {
      const hashedPass = await bcrypt.hash(user.password, 10);
      user.password = hashedPass; // eslint-disable-line
      return user;
    } catch (err) {
      console.log(err);
      return err;
    }
  });

  userModel.prototype.validatePassword = async function validatePassword(password) {
    return bcrypt.compare(password, this.password);
  };

  userModel.associate = models => {
    userModel.hasMany(models.transaction, {
      foreignKey: 'user_id',
      sourceKey: 'id',
      onDelete: 'CASCADE'
    });
    userModel.hasOne(models.budget);
  };

  return userModel;
};
