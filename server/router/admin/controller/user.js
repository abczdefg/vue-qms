const express = require('express');
const Service = require('../service');
let router = express.Router();

module.exports = () => {
  router.get('/users', async (req, res) => {
    try {
      let ret = await Service.User.getUsers();
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
  router.post('/users', async (req, res, next) => {
    try {
      let username = req.body.username;
      let password = common.md5(req.body.password + common.MD5_SUFFIX);
      await Service.User.addUser({
        'username': username,
        'password': password
      });
      res.status(200).send({ code: 200, message: 'success' });
    } catch(e) {
      console.error(e);
      res.status(500).send({ code: 500, message: 'database error' });
    }
  });
  return router;
};

