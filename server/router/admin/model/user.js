const Sequelize = require('sequelize');
const sequelize = require('../../util/db');
let User = sequelize.define('user', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: Sequelize.STRING(255),
    allowNull: false
  },
  password: {
    type: Sequelize.STRING(255),
    allowNull: false
  }
}, {
  freezeTableName: true,
  tableName: 'user',
  timestamps: false
});

module.exports = User;
