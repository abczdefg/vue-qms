const sequelize = require('../../../utils/db.js');
const models = require('../../../model');
module.exports.checkLogin = (session) => {
  return session['userId'];
};
module.exports.saveLoginStatus = (session, {id, role, privilege}) => {
  session['userId'] = id;
  session['role'] = role;
  session['privilege'] = privilege;
};
module.exports.clearLoginStatus = (session) => {
  session = null;
};
module.exports.getUserIdFromSession = (session) => {
  return session['userId'];
};
