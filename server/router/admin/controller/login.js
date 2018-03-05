const express = require('express');
const common = require('../../util/common.js');
const Service = require('../service');
module.exports = () => {
  let router = express.Router();
  router.post('/login', async (req, res) => {
    try {
      let username = req.body.username;
      let password = common.md5(req.body.password + common.MD5_SUFFIX);
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
          req.session['userId'] = user.id;
          req.session['roleId'] = user.role.id;
          req.session['privilege'] = user.role.privilege;
          res.status(200).send({
            code: 200,
            data: {
              username: user.username,
              role: user.role.name
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
    req.session = null;
    res.status(200).send({ code: 200, message: 'success' });
  });
  return router;
};
