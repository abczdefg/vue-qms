const sequelize = require('../../../utils/db.js');
const utils = require('../../../utils');
const models = require('../../../model');
module.exports.getQuestionnaires = async () => {
  return models.Questionnaire.findAll({
    where: {
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
      delete_time: null
    },
    attributes: {
      include: ['id', 'title', 'introduction', 'publish', 'random', 'create_time', 'update_time']
    }
  });
  let question = await models.Question.findAll({
    where: {
      questionnaire_id: id
    },
    order: [['display_order', 'ASC']],
    attributes: {
      include: ['id', 'questionnaire_id', 'title', 'type', 'display_order', 'other']
    }
  });
  questionnaire = utils.toPlain(questionnaire);
  question = utils.toPlain(question);
  questionnaire.question = question.map(item => models.Question.serialize(item));
  return questionnaire;
};
module.exports.addQuestionnaire = async (data) => {
  let ret = await models.Questionnaire.create(data);
  let question = data.question.map((item, i) => {
    item.questionnaire_id = ret.id;
    item.display_order = i + 1;
    return models.Question.convert(item);
  });
  await models.Question.bulkCreate(question, {
    validate: true
  });
};
module.exports.updateQuestionnaire = async (data) => {
  // 更新问卷数据
  await models.Questionnaire.update(data, {
    where: {
      id: data.id
    }
  });
  // 更新问题数据
  let question = data.question.map((item, i) => {
    item.questionnaire_id = data.id;
    item.display_order = i + 1;
    return models.Question.convert(item);
  });
  // 删除问题
  await models.Question.update({
    delete_time: new Date()
  }, {
    where: {
      questionnaire_id: data.id,
      id: {
        $notIn: question.map(item => item.id)
      }
    }
  });
  // 更新or插入
  await models.Question.bulkCreate(question, {
    updateOnDuplicate: true
  });
};

module.exports.publishQuestionnaire = async ({id, publish}) => {
  return models.Questionnaire.update({
    publish
  }, {
    where: {
      id
    }
  });
};

module.exports.deleteQuestionnaireById = async (id) => {
  return sequelize.query(`update questionnaire a, question b set a.delete_time =:now , b.delete_time =:now where a.id = :id and b.questionnaire_id = :id`, {
    replacements: {
      id,
      now: new Date()
    }
  });
};
