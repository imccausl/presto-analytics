const express = require('express');

const controllers = require('./user.controllers');
const requireSignin = require('../../utils/protect');

const router = express.Router();

router.route('/me').get(requireSignin(controllers.me));
router.route('/me/delete').delete(requireSignin(controllers.deleteOwnAccount));
router.route('/details/:userId').post(requireSignin(controllers.changeDetails));

module.exports = router;
