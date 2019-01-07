require('dotenv').config();

const cookieParser = require('cookie-parser');
const express = require('express');
const jwt = require('jsonwebtoken');
const { Server } = require('http');
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');

const dbConfig = require('./db/config');

// set up express server
const app = express();
const http = Server(app);

// set up db interface
const sequelize = new Sequelize('analytics', 'analytics', 'postgres', dbConfig);

// db models
const User = require('./db/models/user')(sequelize, Sequelize);
const Transaction = require('./db/models/transaction')(sequelize, Sequelize, User);

// routes
const userRoutes = require('./routes/users')(User);
const prestoRoutes = require('./routes/presto')(Transaction);
const transactionRoutes = require('./routes/transactions')(Transaction, sequelize, Sequelize);

const PORT = process.env.SERVER_PORT || 3333;

sequelize
  .sync()
  .then(() => console.log('Database and tables created!'))
  .catch(err => console.log('Error:', err));

User.hasMany(Transaction, { foreignKey: 'userId', sourceKey: 'id' });

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// decode the userId on incoming requests
// if the jwt exists
app.use((req, res, next) => {
  const { token } = req.cookies;

  if (token) {
    const { userId } = jwt.verify(token, process.env.APP_SECRET);
    req.userId = userId;
  }

  next();
});
// populate the user on each request if UserId exists
app.use(async (req, res, next) => {
  if (!req.userId) return next();

  try {
    const user = await User.findOne({
      where: {
        id: req.userId
      },
      attributes: ['id', 'firstName', 'lastName', 'email', 'permission']
    });

    req.user = user;
    return next();
  } catch (err) {
    console.log(err);
    return next();
  }
});

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
