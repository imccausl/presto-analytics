require('dotenv').config();

const express = require('express');
const { Server } = require('http');
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');

const { login, isLoggedIn, getBasicAccountInfo, getUsageReport } = require('../presto');
const dbConfig = require('./db/config');

const router = express.Router();
const app = express();
const http = Server(app);
const sequelize = new Sequelize('analytics', 'postgres', 'postgres', dbConfig);

const User = require('./db/models/user')(sequelize, Sequelize);
const Transaction = require('./db/models/transaction')(sequelize, Sequelize, User);

const PORT = process.env.SERVER_PORT || 3333;

// for now just create a single test user over and over
// when the app starts
// User.sync({ force: true })
//   .then(() =>
//     User.create({
//       firstName: 'Test',
//       lastName: 'User',
//       password: '',
//       email: 'test@user.com'
//     })
//   )
//   .catch(err => {
//     console.log('Error:', err);
//   });

// sync/create the Transations table
Transaction.sync();

// Express Middlewaretesttest
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api/v1', router);

// Routes for app:

// Routes for grabbing presto data:
router.post('/presto/login', async (req, res) => {
  const prestoCredentials = req.body;

  if (!prestoCredentials.username && !prestoCredentials.password) {
    res.sendStatus(500);
    console.log('Invalid request body.');
    return;
  }

  try {
    const prestoLoginResp = await login(prestoCredentials.username, prestoCredentials.password);
    const accountInfo = await getBasicAccountInfo();
    console.log(prestoLoginResp);
    res.send(accountInfo);
  } catch (error) {
    res.send({ error });
  }
});

router.get('/presto/usage/:year', async (req, res) => {
  try {
    const usage = await getUsageReport(req.params.year);
    const testUser = await User.findOne({ where: { firstName: 'test' } });

    console.log(`Getting usage report for ${req.params.year}...`);
    res.send(usage);
    console.log(`Saving usage to db...`);
    usage.forEach(async transaction => {
      await Transaction.create({
        userId: 1,
        date: new Date(transaction.date),
        agency: transaction.agency,
        location: transaction.location,
        type: transaction.type,
        amount: transaction.amount.replace(/[($)]/g, '')
      });
    });
  } catch (error) {
    res.send({ error });
  }
});

app.get('/', (req, res) => {
  res.send('PrestoAnalytics server running...');
});

http.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
