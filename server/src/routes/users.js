require('dotenv').config({ path: '../../../.env' });

const express = require('express');
const jwt = require('jsonwebtoken');

const { login, getBasicAccountInfo } = require('../../lib/presto');

const routes = User => {
  const router = express.Router();

  router.get('/me', async (req, res, next) => {
    let accountInfo = {};

    try {
      if (!req.userId) {
        throw new Error('No user logged in');
      }

      const user = await User.findOne({
        where: {
          id: req.userId
        },
        attributes: ['id', 'firstName', 'lastName', 'email', 'cardNumber', 'balance', 'permission']
      });

      if (!user.cardNumber) {
        console.log(process.env.TEST_USERNAME, process.env.TEST_PASSWORD);
        const loginStatus = await login(process.env.TEST_USERNAME, process.env.TEST_PASSWORD);
        console.log(loginStatus);

        if (loginStatus.success) {
          accountInfo = await getBasicAccountInfo();
        }

        user.balance = accountInfo.balance || '0.00';
        user.cardNumber = accountInfo.cardNumber || null;
        await user.save();
      }

      console.log(`User ${user.firstName} logged in!`);
      res.json({ status: 'success', data: user });
    } catch (err) {
      console.error(err.stack);
      return next(err);
    }
  });

  router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({
        where: {
          email
        }
      });

      if (!user) {
        throw new Error("User doesn't exist");
      }
      const isPasswordValid = await user.validatePassword(password);

      if (!isPasswordValid) {
        throw new Error('Invalid password');
      }

      // create JWT token for logged in user
      const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
      res.cookie('token', token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 356
      });

      res.json({ status: 'success', data: user });
    } catch (err) {
      res.json({ status: 'failed', error: err });
    }
  });

  router.post('/signup', async (req, res, next) => {
    const { body } = req;
    const { firstName, lastName, password, passwordAgain } = body;

    try {
      if (password !== passwordAgain) {
        throw new Error('Passwords do not match!');
      }

      body.email = body.email.toLowerCase();

      const user = await User.create({
        firstName,
        lastName,
        email: body.email,
        password,
        permission: ['USER']
      });

      res.json({ status: 'success', message: `User ${firstName} ${lastName} created.`, data: user });
    } catch (err) {
      next(err);
    }
  });

  return router;
};

module.exports = routes;
