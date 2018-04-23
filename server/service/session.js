const authorization = require('../utils/authorization');

module.exports.addSession = (...args) => authorization.addSession(...args);
module.exports.deleteSession = (...args) => authorization.deleteSession(...args);
module.exports.getUserIdFromSession = (...args) => authorization.getUserIdFromSession(...args);
