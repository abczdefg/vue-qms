const express = require('express');
const Service = require('../service');
let router = express.Router();
let { hasPrivilege } = Service.Rbac;
module.exports = () => {
  router.get('/users', hasPrivilege('user'), async (req, res) => {
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
      let password = Service.Md5.md5(req.body.password);
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

