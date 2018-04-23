const express = require('express');
const path = require('path');
const compression = require('compression');
const bodyParser = require('body-parser');
const multer = require('multer');
const middlewares = require('./middleware');
const expressAsyncErrors = require('express-async-errors');
const server = express();

// 解析请求数据
server.use(bodyParser.urlencoded({
  extended: true
}));
server.use(bodyParser.json());
// gzip压缩
server.use(compression());

// 设置session作为登录验证
server.use(middlewares.Authorization.init());

//静态文件
server.use('/', express.static(path.join(__dirname, '../dist')));
server.use('/admin', express.static(path.join(__dirname, '../dist'), {
  index: "admin.html"
}));

//设置路由
server.use('/api', require('./router/web/index')());
server.use('/api/admin', require('./router/admin/index')());

// 没定义的api统一设为404
server.use((req, res, next) => {
  let err = new Error(`Api: ${req.url} is not defined.`);
  err.status = 404;
  next(err);
});

// 错误处理
server.use((err, req, res, next) => {
  let code = err.status || 500;
  let message = err.message || 'Unknown Error';
  if(req.app.get('env') === 'development') {
    console.log(err);
  }
  res.status(code).send({
    message,
    code
  });
});

process.on('unhandledRejection', err => {
  if(req.app.get('env') === 'development') {
    console.error('unhandledRejection:', err)
  }
});

module.exports = server;


