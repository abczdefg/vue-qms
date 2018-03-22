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
  router.post('/users', hasPrivilege('user'), async (req, res, next) => {
    try {
      let { username, password, role } = req.body;
      let user = await Service.User.getUserByName(username);
      if(user !== null) {
        res.status(500).send({ code: 500, message: `Username "${username}" is registered.` });
      } else {
        password = Service.Md5.md5(password);
        await Service.User.addUser({ username, password, role });
        res.status(200).send({ code: 200, message: 'success' });
      }
    } catch(e) {
      console.error(e);
      res.status(500).send({ code: 500, message: 'database error' });
    }
  });
  router.delete('/users/:id', hasPrivilege('user'), async (req, res, next) => {
    try {
      await Service.User.deleteUserById(req.params.id);
      res.status(200).send({ code: 200, message: 'success' });
    } catch(e) {
      console.error(e);
      res.status(500).send({ code: 500, message: 'database error' });
    }
  });
  return router;
};

