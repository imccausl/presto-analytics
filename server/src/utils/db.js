require('dotenv').config();

const Sequelize = require('sequelize');

const config = require('../config/db.config');

const { POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD } = process.env;

const sequelize = new Sequelize(POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD, config);

const connect = (force = false) => {
  sequelize
    .sync({ force })
    .then(() => console.log('Database and tables created!'))
    .catch(err => console.log('Error:', err));
};

module.exports = { connect, sequelize };
