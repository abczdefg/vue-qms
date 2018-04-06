const express = require('express');
const services = require('../../../service');
const utils = require('../../../utils');

module.exports = () => {
  let router = express.Router();
  router.post('/results', async (req, res, next) => {
    try {
      let ip = utils.getIp(req);
      await services.Result.addResult({
        ...req.body,
        ip
      });
      res.status(200).send({ code: 200, message: 'success' });
    } catch(e) {
      console.error(e);
      res.status(500).send({ code: 500, message: 'database error' });
    }
  });
  return router;
};
