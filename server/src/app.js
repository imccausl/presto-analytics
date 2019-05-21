require('dotenv').config();

const cookieParser = require('cookie-parser');
const cors = require('cors');
const express = require('express');
const jwt = require('jsonwebtoken');
const { Server } = require('http');
const bodyParser = require('body-parser');

// set up express server
const app = express();
const http = Server(app);

// routes
const userRoutes = require('./resources/user/user.routes');
const prestoRoutes = require('./resources/presto/presto.routes');
const transactionRoutes = require('./resources/transaction/transaction.routes');
const budgetRoutes = require('./resources/budget/budget.routes');

const { connect } = require('./utils/db');

const PORT = process.env.SERVER_PORT || 3333;
const corsOptions = {
  origin: 'http://localhost:3003',
  credentials: true
};

// setup db connection
connect();

// Middleware
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// decode the userId on incoming requests
// if the jwt exists
app.use((req, res, next) => {
  const { auth } = req.cookies;

  if (auth) {
    const { userId } = jwt.verify(auth, process.env.APP_SECRET);
    req.userId = userId;
  }

  next();
});

// routes
app.use('/api/v1', userRoutes);
app.use('/api/v1/presto', prestoRoutes);
app.use('/api/v1/transactions', transactionRoutes);
app.use('/api/v1/budget', budgetRoutes);

// handle errors as json
app.use((err, req, res, next) => {
  res.status(401).send({
    error: 'error',
    message: err.message,
    body: err // for debugging
  });
});

app.get('/', (req, res) => {
  res.send('PrestoAnalytics server running...');
});

http.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
