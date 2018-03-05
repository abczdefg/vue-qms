/**
 * �ʾ���Ϣ
 */
const mongoose = require('../../util/db.js');
const Schema = mongoose.Schema;
const questionMap = {
  'radio': {
    field: {
      choice: {
        type: [{
          title: String,
          value: String
        }],
        required: true,
        default: undefined // discriminator��bug���ḳ������Ĭ��ֵ
      }
    }
  },
  'checkbox': {
    field: {
      choice: {
        type: [{
          title: String,
          value: String
        }],
        required: true,
        default: undefined // discriminator��bug���ḳ������Ĭ��ֵ
      }
    }
  },
  'matrix-radio': {
    field: {
      subquestion: {
        type: [{
          title: String
        }],
        required: true,
        default: undefined // discriminator��bug���ḳ������Ĭ��ֵ
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
  discriminatorKey: 'type'
});
const Question = mongoose.model('Question', QuestionSchema);
for(let [type, {field}] of Object.entries(questionMap)) {
  Question.discriminator(type, new Schema(field, {
    collection: 'question',
    discriminatorKey: 'type'
  }));
}
module.exports = Question
