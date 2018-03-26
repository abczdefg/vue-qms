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
module.exports.addQuestionnaire = (data) => {
  return sequelize.transaction(async (t) => {
    let ret = await Model.Questionnaire.create(data, {
      transaction: t
    });
    let question = data.question.map((item, i) => {
      item.questionnaire_id = ret.id;
      item.display_order = i + 1;
      return Model.Question.convert(item);
    });
    await Model.Question.bulkCreate(question, {
      validate: true,
      transaction: t
    });
  });
};
module.exports.updateQuestionnaire = (data) => {
  return sequelize.transaction(async (t) => {
    // 更新问卷数据
    await Model.Questionnaire.update(data, {
      where: {
        'id': data.id
      },
      transaction: t
    });
    // 更新问题数据
    let question = data.question.map((item, i) => {
      item.questionnaire_id = data.id;
      item.display_order = i + 1;
      return Model.Question.convert(item);
    });
    // 删除
    await Model.Question.destroy({
      where: {
        questionnaire_id: data.id,
        id: {
          $notIn: question.map(item => item.id)
        }
      },
      transaction: t
    });
    // 更新or插入
    await Model.Question.bulkCreate(question, {
      transaction: t,
      updateOnDuplicate: true
    });
  });
};

module.exports.publishQuestionnaire = ({id, publish}) => {
  return Model.Questionnaire.update({
    publish
  }, {
    where: {
      id
    }
  });
};

module.exports.deleteQuestionnaireById = (id) => {
  return sequelize.query(`delete a, b from questionnaire a left join question b on a.id = b.questionnaire_id where a.id = :id`, {
    replacements: {
      id: id
    }
  });
};
