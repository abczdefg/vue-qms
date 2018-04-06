const express = require('express');
const services = require('../../../service');
const utils = require('../../../utils');

module.exports = () => {
  let router = express.Router();
  router.get('/results', async (req, res, next) => {
    try {
      let results = await services.Result.getResults();
      res.status(200).send({
        code: 200,
        message: 'success',
        data: results
      });
    } catch(e) {
      console.error(e);
      res.status(500).send({ code: 500, message: 'database error' });
    }
  });
  router.get('/results/count', async (req, res) => {
    try {
      let total = await services.Result.getResultsCount();
      res.status(200).send({
        code: 200,
        message: 'success',
        data: {
          total
        }
      });
    } catch(e) {
      console.error(e);
      res.status(500).send({ code: 500, message: 'database error' });
    }
  });
  return router;
};
