const models = require('../../../model');
module.exports.getQuestionsByQuestionnaireId = (questionnaireId) => {
  return models.Question.findAll({
     where: {
       'questionnaire_id': questionnaireId
     },
     order: [['display_order', 'ASC']]
   })
};
