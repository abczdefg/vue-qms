const Sequelize = require('sequelize');
const sequelize = require('../utils/db.js')
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
    allowNull: false
  },
  end_time: {
    type: Sequelize.DATE,
    allowNull: false
  }
}, {
  freezeTableName: true,
  tableName: 'result',
  timestamps: false
});

module.exports = Result;
