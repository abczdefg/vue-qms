/**
 * 问卷信息
 */
const mongoose = require('../../util/db.js');
const Schema = mongoose.Schema;
const questionMap = {
  'radio': {
    field: {
      choice: {
        type: [new Schema({content: String}, {_id: false})],
        required: true,
        default: undefined // discriminator的bug，会赋予数组默认值
      }
    }
  },
  'checkbox': {
    field: {
      choice: {
        type: [new Schema({content: String}, {_id: false})],
        required: true,
        default: undefined // discriminator的bug，会赋予数组默认值
      }
    }
  },
  'matrix-radio': {
    field: {
      choice: {
        type: [new Schema({content: String}, {_id: false})],
        required: true,
        default: undefined // discriminator的bug，会赋予数组默认值
      },
      subquestion: {
        type: [new Schema({content: String}, {_id: false})],
        required: true,
        default: undefined // discriminator的bug，会赋予数组默认值
      }
    }
  }
};
const QuestionSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: Object.keys(questionMap)
  }
}, {
  collection: 'question',
  discriminatorKey: 'type',
  _id: false
});
const QuestionnaireSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  introduction: {
    type: String,
    required: true
  },
  random: {
    type: Boolean,
    required: true
  },
  question: {
    type: [QuestionSchema],
    required: true
  }
}, {
  collection: 'questionnaire',
  versionKey: false
});
for(let [type, {field}] of Object.entries(questionMap)) {
  QuestionnaireSchema.path('question').discriminator(type, new Schema(field, {
    collection: 'question',
    discriminatorKey: 'type',
    _id: false
  }));
}
module.exports = mongoose.model('Questionnaire', QuestionnaireSchema);
