const sequelize = require('../../util/db.js');
const Model = require('../model');
module.exports.getRoleByUserId = (id) => {
  sequelize.query(`select role.name as role, privilege.name as privilege from user_role left join role on user_role.role_id = role.id where user_role.user_id = :user_id`, {
    replacements: {
      user_id: id
    },
    type: sequelize.QueryTypes.SELECT
  })
};
module.exports.getRbacByUserId = (id) => {
  sequelize.query(`select role.name as role, privilege.name as privilege from user_role left join role on user_role.role_id = role.id left join role_privilege on role.id = role_privilege.role_id left join privilege on role_privilege.privilege_id = privilege.id where user_role.user_id = :user_id`, {
    replacements: {
      user_id: id
    },
    type: sequelize.QueryTypes.SELECT
  })
};
