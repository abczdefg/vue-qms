const fs = require('fs');
const path = require('path');
class Utils {
  constructer() {}
  toPlain(data) {
    return JSON.parse(JSON.stringify(data));
  }
  getIp(req) {
    return req.headers['x-forwarded-for'] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;
  }
  loadModule(absolutePath, relativePath = './') {
    let filePath = path.resolve(absolutePath, relativePath);
    let modules = {};
    let files = fs.readdirSync(filePath);
    for(let file of files) {
      if(file === 'index.js' || !/\.js$/.test(file)) {
        continue;
      }
      let name = file.slice(0, -3);
      name = name.charAt(0).toUpperCase() + name.slice(1);
      modules[name] = require(path.resolve(filePath, file));
    }
    return modules;
  }
}

module.exports = (new Utils());
