const express = require('express');
const services = require('../../../service');
const middlewares = require('../../../middleware');
const { checkPrivilege } = middlewares.Authorization;
const router = express.Router();

module.exports = () => {
  router.get('/users', checkPrivilege('user'), async (req, res) => {
    let users = await services.User.getUsers();
    res.status(200).send({
      code: 200,
      message: 'success',
      data: users
    });
  });
  router.get('/users/count', async (req, res) => {
    let total = await services.User.getUsersCount();
    res.status(200).send({
      code: 200,
      message: 'success',
      data: {
        total
      }
    });
  });
  router.post('/users', checkPrivilege('user'), async (req, res, next) => {
    let { username, password, role } = req.body;
    let user = await services.User.getUserByName(username);
    if(user !== null) {
      res.status(500).send({ code: 500, message: `Username "${username}" is registered.` });
    } else {
      password = services.Md5.md5(password);
      await services.User.addUser({ username, password, role });
      res.status(200).send({ code: 200, message: 'success' });
    }
  });
  router.put('/users/:id/password', async (req, res, next) => {
    let id = parseInt(req.params.id, 10);
    let { oldPassword, newPassword } = req.body;
    oldPassword = services.Md5.md5(oldPassword);
    newPassword = services.Md5.md5(newPassword);
    // 判断是否当前用户
    if(id !== req.session.id) {
      return res.status(500).send({ code: 500, message: 'Unmatched user.' });
    }
    // 检查密码是否正确
    let checkPassword = await services.User.checkUserPassword({id, password: oldPassword});
    if(checkPassword === null) {
      return res.status(500).send({ code: 500, message: 'Wrong old password.' });
    }
    await services.User.updateUserPassword({id, password: newPassword});
    res.status(200).send({ code: 200, message: 'success' });
  });
  router.delete('/users/:id', checkPrivilege('user'), async (req, res, next) => {
    await services.User.deleteUserById(req.params.id);
    res.status(200).send({ code: 200, message: 'success' });
  });
  return router;
};

