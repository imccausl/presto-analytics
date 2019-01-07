const express = require('express');

const routes = (Transaction, sequelize, Sequelize) => {
  const router = express.Router();

  router.get('/:year/:month', async (req, res) => {
    const searchDateMin = `${req.params.year}-${req.params.month}-01`;
    const searchDateMax =
      req.params.month === '12' ? `${parseInt(req.params.year, 10) + 1}-01-01` : `${req.params.year}-${parseInt(req.params.month, 10) + 1}-01`;

    const transactions = await Transaction.findAll({
      where: {
        userId: req.userId || 1, // temporary || for testing until the client is up and running
        date: {
          [Sequelize.Op.gte]: new Date(searchDateMin),
          [Sequelize.Op.lt]: new Date(searchDateMax)
        }
      },
      order: sequelize.literal('date ASC')
    });

    const totalAmount = transactions.reduce((sum, trans) => sum + parseFloat(trans.amount), 0);
    const totalTrips = transactions.length;

    res.json({ status: 'success', data: { transactions, totalTrips, totalAmount } });
  });

  return router;
};

module.exports = routes;
