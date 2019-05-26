const express = require('express');

const controllers = require('./user.controllers');

const router = express.Router();

router.route('/me').get(controllers.me);

module.exports = router;
