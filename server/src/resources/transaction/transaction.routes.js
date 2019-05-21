const express = require('express');

const controllers = require('./transaction.controllers');

const router = express.Router();

router.route('/monthly/:year/:month').get(controllers.monthly);

router.route('/all').get(controllers.all);

router.route('/ytd/data').get(controllers.ytdData);

router.route('/ytd').get(controllers.ytd);

module.exports = router;
