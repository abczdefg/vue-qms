const express = require('express');
const controllers = require('./controller');
const services = require('../../service');
const middlewares = require('../../middleware');
const { checkAuthorization } = middlewares.Authorization;
const router = express.Router();

module.exports = () => {
  router.all('*', checkAuthorization);
  for(let [key, fn] of Object.entries(controllers)) {
    router.use('/', fn());
  }
  return router;
};

