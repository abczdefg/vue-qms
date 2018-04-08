const Sequelize = require('sequelize');
const sequelize = require('../utils/db');
let Question = sequelize.define('question', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  questionnaire_id: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  title: {
    type: Sequelize.STRING(255),
    allowNull: false
  },
  type: {
    type: Sequelize.STRING(255),
    allowNull: false
  },
  display_order: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  extra: {
    type: Sequelize.TEXT('medium'),
    allowNull: false
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
  tableName: 'question',
  timestamps: false
});
Question.convert = function(data) {
  let extra = {};
  let exclude = ['title', 'type', 'display_order', 'id', 'delete_time'];
  let include = ['defaultSelectedValue', 'list', 'choice', 'subquestion', 'content', 'blank'];
  for(let [key, value] of Object.entries(data)) {
    if(include.includes(key)) {
      extra[key] = value;
    }
  }
  data.extra = JSON.stringify(extra);
  return data;
};
Question.serialize = function(data) {
  let questionnaire = JSON.parse(data.extra);
  delete data.extra;
  return Object.assign(questionnaire, data);
};
module.exports = Question;
