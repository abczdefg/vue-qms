const express = require('express');
const services = require('../service');
let router = express.Router();
module.exports = () => {
  router.get('/roles', async (req, res) => {
    try {
      let ret = await services.Role.getRoles();
      res.status(200).send({
        code: 200,
        message: 'success',
        data: ret
      });
    } catch(e) {
      console.error(e);
      res.status(500).send({ code: 500, message: 'database error' });
    }
  });
  return router;
};

