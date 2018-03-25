const express = require('express');
const path = require('path');
const compression = require('compression');
const bodyParser = require('body-parser');
const multer = require('multer');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
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
server.use('/', require('./router/web/index')());
server.use('/admin', require('./router/admin/index')());

// catch 404 and forward to error handler
server.use((req, res, next) => {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
server.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  console.log(err.Error)
  res.send({
    message: err.message || 'Unknown Error',
    code: err.status || 500
  });
});


module.exports = server;


