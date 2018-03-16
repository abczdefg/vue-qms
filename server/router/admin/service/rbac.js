const sequelize = require('../../util/db.js');
const Model = require('../model');
module.exports.hasPrivilege = (resource) => {
  return (req, res, next) => {
    if(req.session.privilege.includes(resource)) {
      next();
    } else {
      res.status(403).send({ code: 403, data: {}, message: 'Forbidden' });
    }
  };
};
