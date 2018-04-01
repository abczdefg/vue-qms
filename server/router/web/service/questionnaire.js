const sequelize = require('../../../utils/db.js');
const utils = require('../../../utils');
const models = require('../../../model');

module.exports.getQuestionnaires = () => {
  return models.Questionnaire.findAll({
    where: {
      publish: true,
      delete_time: null
    },
    attributes: {
      include: ['id', 'title', 'introduction', 'publish', 'random', 'create_time', 'update_time']
    }
  });
};
module.exports.getQuestionnaireById = async (id) => {
  let questionnaire = await models.Questionnaire.findOne({
    where: {
      id,
      publish: true,
      delete_time: null
    },
    attributes: {
      include: ['id', 'title', 'introduction', 'publish', 'random', 'create_time', 'update_time']
    }
  });
  let question = await models.Question.findAll({
    where: {
     questionnaire_id: id,
     delete_time: null
    },
    order: [['display_order', 'ASC']],
    attributes: {
      include: ['id', 'questionnaire_id', 'title', 'type', 'display_order', 'other']
    }
  })
  questionnaire = utils.toPlain(questionnaire);
  question = utils.toPlain(question);
  questionnaire.question = question.map(item => models.Question.serialize(item));
  return questionnaire;
};
