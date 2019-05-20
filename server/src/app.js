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
const Budget = require('./db/models/budget')(sequelize, Sequelize, User);

// routes
const userRoutes = require('./routes/users')(User, Budget, Transaction, sequelize, Sequelize);
const prestoRoutes = require('./resources/presto/presto.routes')(Transaction, User);
const transactionRoutes = require('./routes/transactions')(Transaction, sequelize, Sequelize);
const budgetRoutes = require('./routes/budget')(Budget, sequelize, Sequelize);

const PORT = process.env.SERVER_PORT || 3333;
const corsOptions = {
  origin: 'http://localhost:3003',
  credentials: true
};

User.hasMany(Transaction);

sequelize
  .sync()
  .then(() => console.log('Database and tables created!'))
  .catch(err => console.log('Error:', err));

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
