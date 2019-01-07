require('dotenv').config();

const express = require('express');
const { Server } = require('http');
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');

const dbConfig = require('./db/config');

// set up express server
const app = express();
const http = Server(app);

// set up db interface
const sequelize = new Sequelize('analytics', 'postgres', 'postgres', dbConfig);

// db models
const User = require('./db/models/user')(sequelize, Sequelize);
const Transaction = require('./db/models/transaction')(sequelize, Sequelize, User);

// routes
const userRoutes = require('./routes/users')(User);
const prestoRoutes = require('./routes/presto')(Transaction);
const transactionRoutes = require('./routes/transactions')(Transaction, sequelize, Sequelize);

const PORT = process.env.SERVER_PORT || 3333;

sequelize
  .sync({ force: true })
  .then(() => console.log('Database and tables created!'))
  .catch(err => console.log('Error:', err));

User.hasMany(Transaction, { foreignKey: 'userId', sourceKey: 'id' });

// Express Middleware
app.use(bodyParser.urlencoded({ extended: true }));

// routes
app.use('/api/v1', userRoutes);
app.use('/api/v1/presto', prestoRoutes);
app.use('/api/v1/transactions', transactionRoutes);

app.get('/', (req, res) => {
  res.send('PrestoAnalytics server running...');
});

http.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
