const Sequelize = require('sequelize');
const sequelize = require('../../util/db');
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
  other: {
    type: Sequelize.TEXT('medium'),
    allowNull: false
  }
}, {
  freezeTableName: true,
  tableName: 'question',
  timestamps: false
});
Question.convert = (data) => {
  let other = {};
  for(let [key, value] of Object.entries(data)) {
    if(key !== 'title' && key !== 'type' && key !== 'display_order') {
      other[key] = data[key];
    }
  }
  data.other = JSON.stringify(other);
  return data;
};
Question.serialize = (data) => {
  let questionnaire = JSON.parse(data.other);
  delete data.other;
  return Object.assign(questionnaire, data);
};
module.exports = Question;
