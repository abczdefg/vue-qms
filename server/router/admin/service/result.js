const Sequelize = require('sequelize');
const utils = require('../../../utils');
const sequelize = require('../../../utils/db');
const models = require('../../../model');
module.exports.getResults = async () => {
  let results = await models.Result.findAll({
    attributes: {
      include: ['id', 'questionnaire_id', 'ip', 'start_time', 'end_time']
    }
  });
  return results;
};
module.exports.getResultsByQuestionnaireId = async (id) => {
  let question = await models.Question.findAll({
    where: {
      questionnaire_id: id
    },
    order: [['display_order', 'ASC']],
    attributes: {
      include: ['id']
    }
  });
  let questionIdOrder = question.map(item => item.id);
  let results = await models.Result.findAll({
    where: {
      questionnaire_id: id
    },
    attributes: {
      include: ['id', 'ip', 'start_time', 'end_time']
    },
    order: [['start_time', 'DESC'], [sequelize.fn('field', 'answer.question_id', questionIdOrder)]],
    include: [{
      model: models.Answer,
      as: 'answer',
    }]
  });
  return results;
};
