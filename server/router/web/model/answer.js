const Sequelize = require('sequelize');
const sequelize = require('../../util/db');
let Answer = sequelize.define('answer', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  result_id: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  question_id: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  answer: {
    type: Sequelize.STRING(255),
    allowNull: false
  }
}, {
  freezeTableName: true,
  tableName: 'answer',
  timestamps: false
});

module.exports = Answer;
