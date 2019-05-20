const express = require('express');

const controllers = require('./presto.controllers');
const User = require('../user/user.model');

const router = express.Router();

router.route('/login').post(controllers.login);

router.route('/check-login').get(controllers.checkLogin);

router.route('/usage').post(controllers.usage);

router.route('/usage/:cardNumber').get();

module.exports = router;
