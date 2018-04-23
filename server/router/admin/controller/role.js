const express = require('express');
const services = require('../../../service');
const router = express.Router();

module.exports = () => {
  router.get('/roles', async (req, res) => {
    let ret = await services.Role.getRoles();
    res.status(200).send({
      code: 200,
      message: 'success',
      data: ret
    });
  });
  return router;
};

