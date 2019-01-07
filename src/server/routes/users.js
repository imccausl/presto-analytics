const express = require('express');

const routes = User => {
  const router = express.Router();

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

      res.json({ status: 'success', data: user });
    } catch (err) {
      res.json({ status: 'failed', error: err });
    }
  });

  router.post('/signup', async (req, res) => {
    const { body } = req;
    const { firstName, lastName, password } = body;

    body.email = body.email.toLowerCase();

    try {
      const user = await User.create({
        firstName,
        lastName,
        email: body.email,
        password,
        permission: ['USER']
      });

      res.json({ status: 'success', message: `User ${firstName} ${lastName} created.`, data: user });
    } catch (err) {
      res.json({ status: 'error', error: err });
    }
  });

  return router;
};

module.exports = routes;
