const express = require('express');
const services = require('../../../service');
const router = express.Router();

module.exports = () => {
  router.get('/session', async (req, res) => {
    if(services.Session.checkSession(req.session)) {
      const { id, username, role, privilege } = req.session;
      res.status(200).send({ code: 200, data: { id, username, role, privilege },  message: 'Authorized' });
    } else {
      res.status(500).send({ code: 500,  message: 'Invalid request' });
    }
  });
  router.post('/session', async (req, res) => {
    let username = req.body.username;
    let password = services.Md5.md5(req.body.password);
    let user = await services.User.getUserByName(username);
    if (user === null) {
      // 账号不存在
      res.status(500).send({ code: 500, message: 'Username error' });
    } else {
      if(password !== user.password) {
        // 密码错误
        res.status(500).send({ code: 500, message: 'Password error' });
      } else {
        // 登录成功
        services.Session.addSession(req.session, user);
        res.status(200).send({
          code: 200,
          data: {
            id: user.id,
            username: user.username,
            role: user.role,
            privilege: user.privilege
          },
          message: 'Success'
        });
      }
    }
  });
  router.delete('/session', async (req, res) => {
    // await services.Session.deleteSession(req.session);
    req.session = null;
    res.status(200).send({ code: 200, data: {}, message: 'Logout Success' });
  });
  return router;
};
