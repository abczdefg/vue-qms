const express = require('express');
const services = require('../../../service');
const utils = require('../../../utils');
const router = express.Router();

module.exports = () => {
  router.get('/results', async (req, res, next) => {
    let results = await services.Result.getResults();
    res.status(200).send({
      code: 200,
      message: 'success',
      data: results
    });
  });
  router.get('/results/count', async (req, res) => {
    let total = await services.Result.getResultsCount();
    res.status(200).send({
      code: 200,
      message: 'success',
      data: {
        total
      }
    });
  });
  return router;
};
