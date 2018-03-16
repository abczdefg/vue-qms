const sequelize = require('../../util/db.js');
const Model = require('../model');
module.exports.checkLogin = (session) => {
  return session['userId'];
};
module.exports.saveLoginStatus = (session, user) => {
  session['userId'] = user.id;
  session['roleId'] = user.role.id;
  session['privilege'] = user.role.privilege;
};
module.exports.clearLoginStatus = (session) => {
  session = null;
};
