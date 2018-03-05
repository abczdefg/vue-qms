const Sequelize = require('sequelize');
const sequelize = require('../../util/db');
const moment = require('moment');
const Question = require('./question.js');
let Questionnaire = sequelize.define('questionnaire', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: Sequelize.STRING(255),
    allowNull: false
  },
  introduction: {
    type: Sequelize.STRING(255),
    allowNull: false
  },
  random: {
    type: Sequelize.BOOLEAN,
    allowNull: false
  },
  create_time: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,
    get() {
      return moment(this.getDataValue('create_time')).format('YYYY-MM-DD HH:mm:ss');
    }
  },
  update_time: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,
    get() {
      return moment(this.getDataValue('update_time')).format('YYYY-MM-DD HH:mm:ss');
    }
  }
}, {
  freezeTableName: true,
  tableName: 'questionnaire',
  timestamps: false
});
Questionnaire.hasMany(Question, {
  sourceKey: 'id',
  foreignKey: 'questionnaire_id',
  as: 'question',
  onDelete: 'CASCADE',
  hooks: true
});
module.exports = Questionnaire;
