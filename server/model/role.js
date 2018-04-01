const Sequelize = require('sequelize');
const sequelize = require('../utils/db');
let Role = sequelize.define('role', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: Sequelize.STRING(255),
    allowNull: false
  }
}, {
  freezeTableName: true,
  tableName: 'role',
  timestamps: false
});

module.exports = Role;
