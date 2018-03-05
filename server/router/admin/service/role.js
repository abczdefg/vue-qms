const sequelize = require('../../util/db.js');
const Model = require('../model');
module.exports.getRoles = () => {
  return Model.Role.findAll();
};
