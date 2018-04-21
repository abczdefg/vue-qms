const express = require('express');
const controllers = require('./controller');
const services = require('../../service');
let router = express.Router();
module.exports = () => {
  router.all('*', function(req, res, next) {
    if(req.method.toUpperCase() !== 'OPTIONS') {
      if (!services.Session.checkSession(req.session) && req.url !== '/session') {
        let err = new Error('Unauthorized');
        err.status = 401;
        throw err;
      } else {
        next();
      }
    } else {
      next();
    }
  });
  for(let [key, fn] of Object.entries(controllers)) {
    router.use('/', fn());
  }
  return router;
};

