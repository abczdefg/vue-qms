const express = require('express');
const controllers = require('./controller');
const services = require('../../service');
let router = express.Router();
module.exports = () => {
  router.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:8080");
    res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");
    next();
  });
  router.all('*', function(req, res, next) {
    if(req.method.toUpperCase() !== 'OPTIONS') {
      if (!services.Session.checkSession(req.session) && req.url !== '/session') {
        res.status(401).send({ code: 401, message: 'Unauthorized' });
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

