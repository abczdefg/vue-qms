const sequelize = require('../utils/db.js');
const models = require('../model');
module.exports.checkSession = (session) => {
  return /\d+/.test(session['userId']);
};
module.exports.addSession = (session, {id, role, privilege}) => {
  session['userId'] = id;
  session['role'] = role;
  session['privilege'] = privilege;
};
module.exports.deleteSession = (session) => {
  session = null;
};
module.exports.getUserIdFromSession = (session) => {
  return session['userId'];
};
