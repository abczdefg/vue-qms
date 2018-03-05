const sequelize = require('../../util/db.js');
const Model = require('../model');
module.exports.getUserByName = (username) => {
  return Model.User.findOne({
    where: {
      'username': username
    },
    include: [{
      model: Model.Role,
      through: { attributes: [] },
      as: 'role',
      include: [{
        model: Model.Privilege,
        attributes: ['name'],
        through: { attributes: [] },
        as: 'privilege'
      }]
    }]
  })
  .then(res => {
    res = res.get({plain:true});
    res.role = res.role[0];
    res.role.privilege = res.role.privilege.map(item => item.name);
    return Promise.resolve(res);
  })
  .catch(err => Promise.reject(err))
};

module.exports.getUsers = () => {
  return sequelize.query(`select user.id, user.username, role.name as role from user left join user_role on user.id = user_role.user_id left join role on user_role.role_id = role.id`, {
    type: sequelize.QueryTypes.SELECT
  });
}
module.exports.addUser = (data) => {
  return Model.User.create({
    'username': data.username,
    'password': data.password
  });
}
