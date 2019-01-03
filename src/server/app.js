require('dotenv').config();

const express = require('express');
const { Server } = require('http');
const bodyParser = require('body-parser');

const { login, isLoggedIn, getBasicAccountInfo, getUsageReport } = require('../presto');

const router = express.Router();
const app = express();
const http = Server(app);

const PORT = process.env.SERVER_PORT || 3000;

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

router.post('/presto/usage/:year', async (req, res) => {
  try {
    const usage = await getUsageReport(req.params.year);

    console.log(`Getting usage report for ${req.params.year}...`);
    res.send(usage);
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
