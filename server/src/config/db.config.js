module.exports = {
  host: 'postgres',
  dialect: 'postgres',
  operatorsAliases: false,
  define: {
    underscored: true
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};
