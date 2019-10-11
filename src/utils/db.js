const glob = require('glob');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../../.env') });

const Sequelize = require('sequelize');

const config = require('../config/db.config');

const { POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD } = process.env;
const basename = path.basename(module.filename);

let sequelize = new Sequelize(POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD, config);

if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, config);
}

const db = { sequelize, Sequelize };

const onlyModels = file =>
  file.indexOf('.') !== 0 && file !== basename && file.slice(-9) === '.model.js';

const importModel = file => {
  const modelPath = path.join(file);
  const model = sequelize.import(modelPath);

  db[model.name] = model;
};

const associate = modelName => {
  if (typeof db[modelName].associate === 'function') db[modelName].associate(db);
};

const connect = (force = false) => {
  sequelize
    .sync({ force })
    .then(() => console.log('Database and tables created!'))
    .catch(err => console.log('Error:', err));
};

const capitalizeModelNames = key => {
  if (!key.match(/[s]equelize/i)) {
    db[key[0].toUpperCase() + key.substring(1)] = db[key];
    delete db[key];
  }
};

glob
  .sync(path.join(__dirname, '../resources/**/*.model.js'))
  .filter(onlyModels)
  .forEach(importModel);

Object.keys(db).forEach(associate);
Object.keys(db).forEach(capitalizeModelNames);
Object.keys(db).forEach(item => console.log(item));

module.exports = { connect, db };
