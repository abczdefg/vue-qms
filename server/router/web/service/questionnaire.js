const sequelize = require('../../util/db.js');
const Model = require('../model')
const Service = require('./index');
module.exports.getQuestionnaires = () => {
  return Model.Questionnaire.findAll();
};
module.exports.getQuestionnaireById = async (id) => {
  let questionnaire = await Model.Questionnaire.findOne({
    where: {
      'id': id
    },
    include: [{
      model: Model.Question,
      as: 'question',
    }],
    order: [[Model.Question, 'display_order', 'ASC']]
  });
  questionnaire = questionnaire.get({plain:true});
  questionnaire.question = questionnaire.question.map(item => Model.Question.serialize(item));
  return questionnaire;
};
module.exports.submitQuestionnaire = (data) => {
  return sequelize.transaction(async (transaction) => {
    let { ip, questionnaire_id, answer} = data;
    let result = await Model.Result.create({
      ip,
      questionnaire_id
    }, {
      transaction
    });
    let answerArr = handleAnswer(answer).map((item, i) => {
      return {
        result_id: result.id,
        question_id: i + 1,
        answer: item
      };
    })
    await Model.Answer.bulkCreate(answerArr, {
      transaction
    });
  });
};

function handleAnswer(answerArr) {
  return answerArr.map(item => Array.isArray(item) ? item.join(',') : item);
}
