const sequelize = require('../../../utils/db.js');
const models = require('../../../model');
module.exports.getRoles = () => {
  return models.Role.findAll();
};
