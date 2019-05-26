require('dotenv').config({ path: '../../.env' });

const jwt = require('jsonwebtoken');

const { db } = require('./db');

const { User, Transaction } = db;

const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({
      where: {
        email
      },
      include: [
        {
          model: Transaction,
          as: 'transactions'
        }
      ]
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
    res.cookie('auth', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 356
    });

    res.status(200).json({ status: 'success', data: user });
    next();
  } catch (err) {
    next(err);
  }
};

const logout = async (req, res) => {
  res.clearCookie('auth');
  res.json({ status: 'success', message: 'Logout completed' });
};

const signup = async (req, res, next) => {
  const { body } = req;
  const { firstName, lastName, password, passwordAgain } = body;

  try {
    if (password !== passwordAgain) {
      throw new Error('Passwords do not match!');
    }

    if (!body.email) {
      throw new Error('No email provided.');
    }

    body.email = body.email.toLowerCase();

    const user = await User.create({
      firstName,
      lastName,
      email: body.email,
      password,
      cards: [{}],
      permissions: ['USER']
    });

    // create JWT token for logged in user
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    res.cookie('auth', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 356
    });

    res.json({
      status: 'success',
      message: `User ${firstName} ${lastName} created.`,
      data: user
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { login, logout, signup };
