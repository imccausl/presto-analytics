const express = require('express');

const controllers = require('./budget.controllers');

const router = express.Router();

router
  .route('/')
  .post(controllers.save)
  .get(controllers.read);

module.exports = router;
