const Sequelize = require('sequelize');
const sequelize = require('../../util/db.js')
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
  }
}, {
  freezeTableName: true,
  tableName: 'result',
  timestamps: false
});

module.exports = Result;
