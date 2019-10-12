const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  const userModel = sequelize.define('user', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      unique: true
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
    permissions: {
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

  /**
   * HOOKS
   */
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

  /**
   * INSTANCE CLASSES
   */

  userModel.prototype.validatePassword = async function validatePassword(password) {
    return bcrypt.compare(password, this.password);
  };

  /**
   * ASSOCIATIONS
   */

  userModel.associate = models => {
    userModel.hasMany(models.transaction, {
      foreignKey: {
        name: 'userId',
        field: 'user_id'
      },
      sourceKey: 'id',
      onDelete: 'CASCADE',
      as: 'transactions'
    });

    userModel.hasOne(models.budget, {
      foreignKey: {
        name: 'userId',
        field: 'user_id'
      },
      sourceKey: 'id',
      onDelete: 'CASCADE',
      as: 'budget'
    });
  };

  return userModel;
};
