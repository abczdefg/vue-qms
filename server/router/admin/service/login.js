const sequelize = require('../../util/db.js');
const Model = require('../model');
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
