const express = require('express');
const Service = require('../service');
module.exports = () => {
  let router = express.Router();
  router.post('/login', async (req, res) => {
    try {
      let username = req.body.username;
      let password = Service.Md5.md5(req.body.password);
      let user = await Service.User.getUserByName(username);
      if (user === null) {
        // 账号不存在
        res.status(500).send({ code: 500, data: {}, message: 'username error' });
      } else {
        if(password !== user.password) {
          // 密码错误
          res.status(500).send({ code: 500, data: {}, message: 'password error' });
        } else {
          // 登录成功
          Service.Login.saveLoginStatus(req.session, user);
          res.status(200).send({
            code: 200,
            data: {
              username: user.username,
              role: user.role,
              privilege: user.privilege
            },
            message: 'success'
          });
        }
      }
    } catch (e) {
      console.error(e);
      res.status(500).send({ code: 500, message: 'database error' });
    }
  });
  router.get('/logout', (req, res) => {
    Service.Login.clearLoginStatus(req.session);
    res.status(200).send({ code: 200, message: 'success' });
  });
  return router;
};
