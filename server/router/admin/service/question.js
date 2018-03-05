const Question = require('../model/question.js');
module.exports.getQuestionsByQuestionnaireId = (questionnaireId) => {
  return Question.findAll({
     where: {
       'questionnaire_id': questionnaireId
     },
     order: [['display_order', 'ASC']]
   })
};
