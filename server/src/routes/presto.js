const express = require('express');

const { login, getBasicAccountInfo, getUsageReport } = require('../../lib/presto');

const routes = Transaction => {
  const router = express.Router();

  router.post('/login', async (req, res) => {
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

  router.get('/usage/:year', async (req, res) => {
    try {
      const usage = await getUsageReport(req.params.year);
      // const testUser = await User.findOne({ where: { firstName: 'test' } });

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

  return router;
};

module.exports = routes;
