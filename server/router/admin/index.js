const express = require('express');
const Service = require('./service');
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
      if (!Service.Login.checkLogin(req.session) && req.url !== '/login' && req.url !== '/logout') {
        res.status(400).send({ code: 400, data: {}, message: 'Unauthorized' });
      } else {
        next();
      }
    } else {
      next();
    }
  });
  router.use('/', require('./controller/login')());
  router.use('/', require('./controller/questionnaire')());
  router.use('/', require('./controller/user')());
  router.use('/', require('./controller/role')());
  return router;
};

