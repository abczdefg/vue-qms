const Sequelize = require('sequelize');
const sequelize = require('../utils/db');
const Privilege = require('./privilege.js');
const Role = require('./role.js');
let RolePrivilege = sequelize.define('rolePrivilege', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  role_id: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  privilege_id: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
}, {
  freezeTableName: true,
  tableName: 'role_privilege',
  timestamps: false
});
Privilege.belongsToMany(Role, {
  through: RolePrivilege,
  foreignKey: 'privilege_id',
  as: 'privilege'
})
Role.belongsToMany(Privilege, {
  through: RolePrivilege,
  foreignKey: 'role_id',
  as: 'privilege'
})
module.exports = RolePrivilege;
