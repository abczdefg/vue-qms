const Sequelize = require('sequelize');
const moment = require('moment');
const sequelize = require('../utils/db.js')
const Answer = require('./answer.js');
let Result = sequelize.define('result', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  questionnaire_id: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  ip: {
    type: Sequelize.STRING(255),
    allowNull: false,
    validate: {
      isIP: true
    }
  },
  start_time: {
    type: Sequelize.DATE,
    allowNull: false,
    get() {
      return moment(this.getDataValue('start_time')).format('YYYY-MM-DD HH:mm:ss');
    }
  },
  end_time: {
    type: Sequelize.DATE,
    allowNull: false,
    get() {
      return moment(this.getDataValue('end_time')).format('YYYY-MM-DD HH:mm:ss');
    }
  }
}, {
  freezeTableName: true,
  tableName: 'result',
  timestamps: false
});

Result.hasMany(Answer, {
  sourceKey: 'id',
  foreignKey: 'result_id',
  as: 'answer',
  onDelete: 'CASCADE',
  hooks: true
});
module.exports = Result;
