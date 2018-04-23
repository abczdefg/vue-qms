const authorization = require('../utils/authorization');

module.exports.init = (...args) => authorization.init(...args);
module.exports.checkAuthorization = (...args) => authorization.checkAuthorization(...args);
module.exports.checkPrivilege = (...args) => authorization.checkPrivilege(...args);
