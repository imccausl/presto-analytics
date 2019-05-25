const express = require('express');

const controllers = require('./transaction.controllers');
const requireSignin = require('../../utils/protect');

const router = express.Router();

/**
 * USE CASES FOR Transaction ROUTES:
 *  - delete all
 *  - create all (if we go the presto library on the front-end route)
 *  - update all (?)
 *
 *  - delete all belonging to a card
 *  - get all belonging to a card
 *  - update all belonging to a card
 *  - create all belonging to a card
 *
 *  - get all transactions by year
 * - get transactions by card/year
 */

router.route('/monthly/:year/:month').get(requireSignin(controllers.monthly));

router.route('/all').get(requireSignin(controllers.all));

router.route('/ytd/data').get(requireSignin(controllers.ytdData));

router.route('/ytd').get(requireSignin(controllers.ytd));

module.exports = router;
