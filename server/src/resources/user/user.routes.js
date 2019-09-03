const express = require('express');

const controllers = require('./user.controllers');
const requireSignin = require('../../utils/protect');

const router = express.Router();

router.route('/me').get(requireSignin(controllers.me));
router.route('/me/delete').delete(requireSignin(controllers.deleteOwnAccount));

module.exports = router;
