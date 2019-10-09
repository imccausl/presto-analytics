const express = require('express');

const controllers = require('./budget.controllers');

const router = express.Router();

router
  .route('/')
  .get(controllers.read)
  .post(controllers.save)
  .put()
  .delete();

module.exports = router;
