const Sequelize = require('sequelize');
const sequelize = require('../utils/db');
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
    type: Sequelize.STRING(255),
    allowNull: false,
    get() {
      return JSON.parse(this.getDataValue('random'));
    },
    set(val) {
      this.setDataValue('random', JSON.stringify(val));
    }
  },
  publish: {
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
  },
  delete_time: {
    type: Sequelize.DATE,
    defaultValue: null,
    get() {
      let deleteTime = this.getDataValue('delete_time');
      return deleteTime ? moment(deleteTime).format('YYYY-MM-DD HH:mm:ss') : null;
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
