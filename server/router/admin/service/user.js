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
  }).then(
    user => {
      if(user !== null) {
        user = user.get({plain:true});
        user.privilege = user.role[0].privilege.map(item => item.name);
        user.role = user.role[0].name;
      }
      return Promise.resolve(user)
    }
  ).catch(err => Promise.reject(err));
};

module.exports.getUsers = () => {
  return sequelize.query(`select user.id, user.username, role.name as role from user left join user_role on user.id = user_role.user_id left join role on user_role.role_id = role.id`, {
    type: sequelize.QueryTypes.SELECT
  });
}
module.exports.addUser = ({username, password, role}) => {
  return sequelize.transaction(async (t) => {
    let ret = await Model.User.create({username, password}, {
      transaction: t
    });
    await Model.UserRole.create({
      user_id: ret.id,
      role_id: role
    }, {
      transaction: t
    });
  });
}
module.exports.deleteUserById = (id) => {
  return sequelize.query(`delete a, b from user a left join user_role b on a.id = b.user_id where a.id = :id`, {
    replacements: {
      id: id
    }
  });
}
module.exports.checkUserPassword = ({id, password}) => {
  return Model.User.findOne({
    where: {
      id,
      password
    },
  });
}
module.exports.updateUserPassword = ({id, password}) => {
  return Model.User.update({
    password
  }, {
    where: {
      id
    }
  });
}
