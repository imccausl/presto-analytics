const express = require('express');

const controllers = require('./transaction.controllers');
const requireSignin = require('../../utils/protect');

const router = express.Router();

/**
 * USE CASES FOR Transaction ROUTES:
 *  - delete all [done]
 *  - create all (if we go the presto library on the front-end route) [done]
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

router.route('/:cardNumber/monthly/:year/:month').get(requireSignin(controllers.monthly));
router.route('/:cardNumber/range').get(requireSignin(controllers.range));

router
  .route('/')
  .get(requireSignin(controllers.getAll))
  .post(requireSignin(controllers.postAll))
  .delete(requireSignin(controllers.deleteAll));

router
  .route('/:cardNumber')
  .get()
  .post()
  .delete();

router.route('/ytd/data').get(requireSignin(controllers.ytdData));

router.route('/ytd').get(requireSignin(controllers.ytd));

module.exports = router;
