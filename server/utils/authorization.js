const cookieSession = require('cookie-session');
class Authorization {
  constructor() {}
  init(options = {}) {
    if(Object.prototype.toString.call(options) !== '[object Object]') {
      options = {};
    }
    const defaults = {
      name: 'sid',
      keys: ['encode', 'decode'],
      maxAge: 60 * 60 * 1000,
      httpOnly: true
    };
    Object.assign(options, defaults);
    return cookieSession(options);
  }
  checkAuthorization(req, res, next) {
    const { session, url } = req;
    const method = req.method.toUpperCase();
    if(url === '/session') {
      return next();
    }
    if(method === 'OPTIONS') {
      return next();
    }
    if(this.checkSession(session)) {
      this.updateSession(session);
      return next();
    }
    let err = new Error('Unauthorized');
    err.status = 401;
    throw err;
  }
  checkPrivilege(resource) {
    return (req, res, next) => {
      if(req.session.privilege && req.session.privilege.includes(resource)) {
        return next();
      } else {
        let err = new Error('Forbidden');
        err.status = 403;
        throw err;
      }
    };
  }
  checkSession(session) {
    return session.isPopulated;
  };
  addSession(session, {id, username, role, privilege}) {
    Object.assign(session, {id, username, role, privilege});
  }
  updateSession(session) {
    session.now = (new Date()).getTime();
  }
  deleteSession(session) {
    session = null;
  }
}

module.exports = new Authorization();
