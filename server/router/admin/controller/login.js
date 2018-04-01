const express = require('express');
const services = require('../service');
module.exports = () => {
  let router = express.Router();
  router.post('/login', async (req, res) => {
    try {
      let username = req.body.username;
      let password = services.Md5.md5(req.body.password);
      let user = await services.User.getUserByName(username);
      if (user === null) {
        // 账号不存在
        res.status(500).send({ code: 500, data: {}, message: 'Username error' });
      } else {
        if(password !== user.password) {
          // 密码错误
          res.status(500).send({ code: 500, data: {}, message: 'Password error' });
        } else {
          // 登录成功
          services.Login.saveLoginStatus(req.session, user);
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
    } catch (e) {
      console.error(e);
      res.status(500).send({ code: 500, message: 'Database error' });
    }
  });
  router.get('/logout', (req, res) => {
    services.Login.clearLoginStatus(req.session);
    res.status(200).send({ code: 200, message: 'Success' });
  });
  return router;
};
