const express = require('express');
const path = require('path');
const compression = require('compression');
const bodyParser = require('body-parser');
const multer = require('multer');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const expressAsyncErrors = require('express-async-errors');
const server = express();
// 解析请求数据
server.use(bodyParser.urlencoded({
  extended: true
}));
server.use(bodyParser.json());
// gzip压缩
server.use(compression());
// 设置cookie，session
server.use(cookieParser('cookie_secret'));
server.use(cookieSession({
  name: 'sid',
  keys: ['key_1', 'key_2'],
  maxAge: 60 * 60 * 1000,
  httpOnly: true
}));

// server.set('view engine', 'jade');

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
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  console.log(err);
  res.send({
    message: err.message || 'Unknown Error',
    code: err.status || 500
  });
});

process.on('unhandledRejection', err => console.error('unhandledRejection:', err));

module.exports = server;


