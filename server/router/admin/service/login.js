const sequelize = require('../../util/db.js');
const Model = require('../model');
module.exports.checkLogin = (session) => {
  return session['userId'];
};
module.exports.saveLoginStatus = (session, {id: userId, role, privilege}) => {
  session['userId'] = userId;
  session['role'] = role;
  session['privilege'] = privilege;
  console.log(session)
};
module.exports.clearLoginStatus = (session) => {
  session = null;
};
