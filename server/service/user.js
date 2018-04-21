const sequelize = require('../utils/db.js');
const utils = require('../utils');
const models = require('../model');
module.exports.getUserByName = async (username) => {
  let user = await models.User.findOne({
    where: {
      username,
      delete_time: null
    },
    attributes: {
      includes: ['id', 'username', 'password', 'create_time']
    }
  });
  if(user === null) {
    let err = new Error(`User: ${id} is not found.`);
    err.status = 404;
    throw err;
  }
  user = utils.toPlain(user);
  let userRole = await models.UserRole.findOne({
    where: {
      user_id: user.id
    }
  });
  userRole = utils.toPlain(userRole);

  let role =  await models.Role.findOne({
    where: {
      id: userRole.role_id
    }
  });
  role = utils.toPlain(role);

  let rolePrivilege =  await models.RolePrivilege.findAll({
    where: {
      role_id: role.id
    }
  });
  rolePrivilege = utils.toPlain(rolePrivilege);

  let privilege =  await models.Privilege.findAll({
    where: {
      id: {
        $in: rolePrivilege.map(item => item.privilege_id)
      }
    }
  });
  privilege = utils.toPlain(privilege);

  user.role = role.name;
  user.privilege = privilege.map(item => item.name);

  return user;
};

module.exports.getUsers = async () => {
  let users = await models.User.findAll({
    where: {
      delete_time: null
    },
    attributes: {
      includes: ['id', 'username', 'password', 'create_time']
    },
    include: [{
      model: models.Role,
      as: 'role',
      through: {
        attributes: ['name']
      }
    }]
  });
  return utils.toPlain(users).map(item => ({
    id: item.id,
    username: item.username,
    create_time: item.create_time,
    role: item.role[0].name,
  }));
}
module.exports.addUser = async ({username, password, role}) => {
  let user = await models.User.create({
    username,
    password,
    create_time: new Date()
  });
  await models.UserRole.create({
    user_id: user.id,
    role_id: role
  });
}
module.exports.deleteUserById = async (id) => {
  return models.User.update({
    delete_time: new Date()
  }, {
    where: {
      id,
      name: {
        $not: 'admin'
      }
    }
  });
}
module.exports.checkUserPassword = async ({id, password}) => {
  return models.User.findOne({
    where: {
      id,
      password,
      delete_time: null
    },
  });
}
module.exports.updateUserPassword = async ({id, password}) => {
  return models.User.update({
    password
  }, {
    where: {
      id,
      delete_time: null
    }
  });
}
module.exports.getUsersCount = async () => {
  return models.User.count({
    where: {
      delete_time: null
    }
  });
}
