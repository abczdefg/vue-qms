const Sequelize = require('sequelize');
const sequelize = require('../../util/db');
const moment = require('moment');
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
  },
  create_time: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,
    get() {
      return moment(this.getDataValue('create_time')).format('YYYY-MM-DD HH:mm:ss');
    }
  }
}, {
  freezeTableName: true,
  tableName: 'user',
  timestamps: false
});

module.exports = User;
