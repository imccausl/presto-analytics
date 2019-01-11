require('dotenv').config();

const cookieParser = require('cookie-parser');
const cors = require('cors');
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
const corsOptions = {
  origin: 'http://localhost:3003',
  credentials: true
};

sequelize
  .sync()
  .then(() => console.log('Database and tables created!'))
  .catch(err => console.log('Error:', err));

User.hasMany(Transaction, { foreignKey: 'userId', sourceKey: 'id' });

// Middleware
app.use(cors(corsOptions));
app.use(bodyParser.json());
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

// routes
app.use('/api/v1', userRoutes);
app.use('/api/v1/presto', prestoRoutes);
app.use('/api/v1/transactions', transactionRoutes);

// handle errors as json
app.use((err, req, res) => {
  try {
    console.error(err.stack);
    res.send({
      error: 'error',
      message: err.message
    });
  } catch (error) {
    console.error(error.stack);
  }
});

app.get('/', (req, res) => {
  res.send('PrestoAnalytics server running...');
});

http.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
