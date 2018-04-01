const sequelize = require('../../../utils/db.js');
const models = require('../../../model');
module.exports.addResult = async (data) => {
  return sequelize.transaction(async (transaction) => {
    let { ip, questionnaire_id, answer, start_time, end_time } = data;
    let result = await models.Result.create({
      ip,
      questionnaire_id,
      start_time,
      end_time
    }, {
      transaction
    });
    let answerArr = joinAnswer(answer).map((item, i) => {
      return {
        result_id: result.id,
        question_id: i + 1,
        answer: item
      };
    })
    await models.Answer.bulkCreate(answerArr, {
      transaction
    });
  });
};

function joinAnswer(answerArr) {
  return answerArr.map(item => Array.isArray(item) ? item.join(',') : item);
}
