const Sequelize = require('sequelize');
const sequelize = require('../utils/db');
let Privilege = sequelize.define('privilege', {
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
  tableName: 'privilege',
  timestamps: false
});

module.exports = Privilege;
