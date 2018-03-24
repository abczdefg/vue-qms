const express = require('express');
const Service = require('../service');
let router = express.Router();
let { hasPrivilege } = Service.Rbac;
module.exports = () => {
  router.get('/users', hasPrivilege('user'), async (req, res) => {
    try {
      let users = await Service.User.getUsers();
      res.status(200).send({
        code: 200,
        message: 'success',
        data: users
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
  router.put('/users/:id/password', async (req, res, next) => {
    try {
      let id = parseInt(req.params.id, 10);
      let { oldPassword, newPassword } = req.body;
      oldPassword = Service.Md5.md5(oldPassword);
      newPassword = Service.Md5.md5(newPassword);
      // 判断是否当前用户
      if(id !== Service.Login.getUserIdFromSession(req.session)) {
        return res.status(500).send({ code: 500, message: 'Unmatched user.' });
      }
      // 检查密码是否正确
      let checkPassword = await Service.User.checkUserPassword({id, password: oldPassword});
      if(checkPassword === null) {
        return res.status(500).send({ code: 500, message: 'Wrong old password.' });
      }
      await Service.User.updateUserPassword({id, password: newPassword});
      res.status(200).send({ code: 200, message: 'success' });
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

