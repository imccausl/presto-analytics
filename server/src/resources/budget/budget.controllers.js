const { db } = require('../../utils/db');

const { Budget } = db;

const save = async (req, res, next) => {
  try {
    const { body } = req;
    const { monthlyPassCost, fareCost } = body;

    if (!req.userId) {
      throw new Error('You must be logged into to do that');
    }

    const budget = await Budget.findOne({
      where: {
        userId: req.userId
      }
    });

    console.log(budget);

    if (!budget) {
      const createdBudget = await Budget.create({
        userId: req.userId,
        monthlyPassCost,
        fareCost,
        agency: 'Toronto Transit Commission'
      });

      res.send({ status: 'success', data: createdBudget });
    } else {
      budget.monthlyPassCost = monthlyPassCost;
      budget.fareCost = fareCost;
      await budget.save();

      res.send({ status: 'success', data: budget });
    }
  } catch (error) {
    next(error);
  }
};

const read = async (req, res, next) => {
  try {
    if (!req.userId) {
      throw new Error('You must be logged in to do that');
    }

    const budget = await Budget.findOne({
      where: {
        userId: req.userId
      }
    });

    console.log(budget, req.userId);

    res.json({ status: 'success', data: budget });
  } catch (error) {
    next(error);
  }
};

module.exports = { save, read };
