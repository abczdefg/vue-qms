const models = require('../model');
module.exports.getQuestionsByQuestionnaireId = (questionnaireId) => {
  return models.Question.findAll({
    where: {
      questionnaire_id: questionnaireId,
      delete_time: null
    },
    attributes: {
      include: ['id', 'title', 'type', 'extra']
    },
    order: [['display_order', 'ASC']]
   });
};
