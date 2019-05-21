const express = require('express');

const controllers = require('./user.controllers');

const router = express.Router();

router.route('/me').get(controllers.me);

router.route('/login').post(controllers.login);

router.route('/logout').get(controllers.logout);

router.route('/signup').post(controllers.signup);

module.exports = router;
