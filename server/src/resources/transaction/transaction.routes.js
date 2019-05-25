const express = require('express');

const controllers = require('./transaction.controllers');
const requireSignin = require('../../utils/protect');

const router = express.Router();

router.route('/monthly/:year/:month').get(requireSignin(controllers.monthly));

router.route('/all').get(requireSignin(controllers.all));

router.route('/ytd/data').get(requireSignin(controllers.ytdData));

router.route('/ytd').get(requireSignin(controllers.ytd));

module.exports = router;
