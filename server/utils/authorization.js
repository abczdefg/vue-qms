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
    const { session, url, method } = req;
    const checkSession = (session) => {
      return session.isPopulated;
    };
    if(req.method.toUpperCase() !== 'OPTIONS') {
      if (!checkSession(session) && url !== '/session') {
        let err = new Error('Unauthorized');
        err.status = 401;
        throw err;
      } else {
        this.updateSession(session);
        next();
      }
    } else {
      next();
    }
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
  addSession(session, {id, role, privilege}) {
    Object.assign(session, {id, role, privilege});
  }
  updateSession(session) {
    session.now = (new Date()).getTime();
  }
  deleteSession(session) {
    session = null;
  }
}

module.exports = new Authorization();
