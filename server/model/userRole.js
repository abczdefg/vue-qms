const Sequelize = require('sequelize');
const sequelize = require('../utils/db');
const User = require('./user.js');
const Role = require('./role.js');
let UserRole = sequelize.define('userRole', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  role_id: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
}, {
  freezeTableName: true,
  tableName: 'user_role',
  timestamps: false
});
User.belongsToMany(Role, {
  through: UserRole,
  foreignKey: 'user_id',
  as: 'role'
})
Role.belongsToMany(User, {
  through: UserRole,
  foreignKey: 'role_id',
  as: 'role'
})
module.exports = UserRole;
