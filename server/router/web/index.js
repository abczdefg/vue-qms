const express = require('express');
const controllers = require('./controller');
const router = express.Router();

module.exports = () => {
  for(let [key, fn] of Object.entries(controllers)) {
    router.use('/', fn());
  }
  return router;
};

