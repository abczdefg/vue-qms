<template>
  <div class="questionnaire-detail">
    <ul class="questionnaire-detail-side question-type">
      <li class="question-type-item" v-for="item in allQuestionType" :key="item.type" @click="addQuestion(item.type)">
        <el-button plain class="question-type-item-button">{{item.title}}</el-button>
      </li>
    </ul>
    <div class="questionnaire-detail-content">
      <el-form class="questionnaire-form questionnaire-detail-content-row" :model="questionnaireForm" ref="questionnaireForm" :rules="questionnaireRules" label-position="left" label-width="0">
        <el-form-item class="questionnaire-title" prop="title">
          <el-input v-model="questionnaireForm.title" placeholder="请输入问卷标题"></el-input>
        </el-form-item>
        <el-form-item class="questionnaire-introduction" prop="introduction">
          <el-input type="textarea" :autosize="{minRows:3}" v-model="questionnaireForm.introduction" placeholder="请输入问卷介绍"></el-input>
        </el-form-item>
        <div class="questionnaire-question" :class="{dragging: dragging}">
          <div class="delete-block">
            <draggable id="question-delete-block" class="delete-block__content" :options="dragDeleteOptions">
              <i class="el-icon-delete"></i>
            </draggable>
          </div>
          <draggable :class="{dragging: dragging}" v-model="questionnaireForm.question" :options="dragQuestionOptions" @start="dragStart" @end="dragEnd">
            <qnr-question
              v-for="(item, index) in addQuestionIndex(questionnaireForm).question"
              :class="{draggable:!disableDraggable}"
              :key="item.index"
              :data="item"
              @update:data="data => updateQuestion(index, data)"
              @delete:data="data => deleteQuestion(index, data)"
              :mode="item.mode"
            >
            </qnr-question>
          </draggable>
        </div>
      </el-form>
      <el-row class="questionnaire-random questionnaire-detail-content-row">
        <span>随机列表：</span>
        <span>{{questionnaireForm.random}}</span>
        <el-button icon="el-icon-setting" size="mini" :circle="true" @click="randomVisible=true"></el-button>
      </el-row>
      <el-row class="questionnaire-button questionnaire-detail-content-row">
        <el-button type="primary" size="small" @click="saveQuestionnaire('questionnaireForm')">保存问卷</el-button>
        <el-button type="danger" size="small" @click="cancelQuestionnaire">取消编辑</el-button>
      </el-row>
    </div>
    <el-dialog class="random-dialog" title="随机列表" :visible.sync="randomVisible" top="0" width="75%">
      <qnr-random-table :options="randomTable" :column="10" v-model="questionnaireForm.random"></qnr-random-table>
      <template slot="footer">{{questionnaireForm.random}}</template>
    </el-dialog>
  </div>
</template>
<script>
import Draggable from 'vuedraggable'
import { addQuestionIndex } from '@/utils';
import { getQuestionnaire, updateQuestionnaire, addQuestionnaire } from '@admin/api';
import { QnrQuestion } from '@admin/components/question/index.js';
import QnrRandomTable from '@admin/components/questionnaire/QnrRandomTable.vue'
export default {
  components: {
    Draggable,
    QnrQuestion,
    QnrRandomTable
  },
  props: ['id'],
  data() {
    return {
      questionnaireForm: {
        title: '',
        introduction: '',
        question: [],
        random: []
      },
      questionnaireRules: {
        title: [
          { required: true, message: '请输入问卷名', trigger: 'blur' }
        ],
        introduction: [
          { required: true, message: '请输入问卷介绍', trigger: 'blur' }
        ]
      },
      allQuestionType: QnrQuestion.getAllType(),
      dragging: false,
      dragDeleteOptions: {
        disabled: this.disableDraggable,
        group: {
          name: 'question',
          put: true
        }
      },
      dragQuestionOptions: {
        disabled: this.disableDraggable,
        group: {
          name: 'question',
          pull: 'clone'
        }
      },
      randomVisible: false
    }
  },
  created() {
    if(this.isEditPage) {
      this.getQuestionnaire(this.id);
    }
  },
  mounted() {
  },
  beforeDestroy() {
  },
  watch: {
    disableDraggable(val) {
      this.dragDeleteOptions.disabled = val;
      this.dragQuestionOptions.disabled = val;
    }
  },
  computed: {
    isEditPage() {
      return typeof this.id !== 'undefined';
    },
    disableDraggable() {
      return this.$store.state.questionnaire.isEditing;
    },
    randomTable() {
      return this.questionnaireForm.question.map(v => ({title:v.title}))
    }
  },
  methods: {
    checkEditing() {
      if(this.$store.state.questionnaire.isEditing) {
        this.$message.error('存在编辑中的问题');
        return true;
      }
      return false;
    },
    updateQuestion(index, data) {
      delete data.mode;
      this.questionnaireForm.question.splice(index, 1, data);
    },
    addQuestion(type) {
      if(this.checkEditing()) {
        return;
      }
      this.questionnaireForm.question.push({ type, mode: 'add' });
      this.$nextTick(() => this.scrollToBottom());
    },
    deleteQuestion(index) {
      const question = this.questionnaireForm.question[index];
      if(question.mode === 'add') {
        this.questionnaireForm.question.splice(index, 1);
        return;
      }
      if(this.checkEditing()) {
        return;
      }
      this.$confirm('确认删除问题？').then(
        () => this.questionnaireForm.question.splice(index, 1)
      ).catch(err => err);
    },
    getQuestionnaire(id) {
      getQuestionnaire({id}).then(
        res => {
          let data = res.data;
          this.questionnaireForm = data;
        }
      ).catch(
        err => {
          this.$message.error(`获取问卷失败：${err.message}`);
          return this.$router.replace({name: "questionnaire"});
        }
      )
    },
    addQuestionIndex: addQuestionIndex,
    validateQuestionnaire(formName) {
      return new Promise((resolve, reject) => {
        // 存在编辑的问题
        if(this.checkEditing()) {
          return reject();
        }
        // 题目数为0
        if(this.questionnaireForm.question.length === 0) {
          this.$message.error('至少要有一个题目');
          return reject();
        }
        this.$refs[formName].validate()
        .then(valid => resolve(valid))
        .catch(err => err);
      });
    },
    saveQuestionnaire(formName) {
      this.validateQuestionnaire(formName).then(
        valid => {
          this.questionnaireForm.id = this.id;
          if(this.isEditPage) {
            this.questionnaireForm.update_time = new Date();
            this.editQuestionnaire();
          } else {
            this.questionnaireForm.publish = false;
            this.questionnaireForm.create_time = new Date();
            this.questionnaireForm.update_time = new Date();
            this.addQuestionnaire();
          }
        }
      ).catch(err => err);
    },
    cancelQuestionnaire() {
      this.$router.replace({name: "questionnaire"});
    },
    addQuestionnaire() {
      addQuestionnaire(this.questionnaireForm).then(
        res => {
          this.$message.success('问卷保存成功');
          this.cancelQuestionnaire();
        }
      ).catch(
        err => this.$message.error(`添加问卷失败：${err.message}`)
      )
    },
    editQuestionnaire() {
      updateQuestionnaire(this.questionnaireForm).then(
        res => {
          this.$message.success('问卷保存成功');
          this.cancelQuestionnaire();
        }
      ).catch(
        err => this.$message.error(`保存问卷失败：${err.message}`)
      )
    },
    dragStart() {
      this.dragging = true;
    },
    dragEnd(evt) {
      if(evt.to.id === 'question-delete-block') {
        this.deleteQuestion(evt.oldIndex);
      }
      this.dragging = false;
    },
    scrollToBottom() {
      const form = document.querySelector('.questionnaire-form');
      let distance = form.scrollHeight - form.offsetHeight;
      let step = 10;
      let delay = 300;
      let per = distance / (delay / step);
      let interval = setInterval(() => {
        let currentTop = form.scrollTop;
        if(currentTop < distance) {
          form.scrollTop = currentTop + per;
        } else {
          clearInterval(interval);
        }
      }, step);
    }
  }
}

</script>
<style lang="less" scoped>
.questionnaire-detail {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  flex: 1;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  flex-direction: row;
  overflow-y: hidden;
  &-side {
    width: 150px;
    padding: 10px;
    border-right: 1px solid #e0e0e0;
    text-align: center;
  }
  .question-type {
    &-item {
      margin-bottom: 10px;
      &-button {
        width: 100%;
        padding: 10px;
      }
    }
  }
  &-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    &-row {
      padding: 10px;
      border-bottom: 1px solid #e0e0e0;
      &:last-child {
        border-bottom: 0;
      }
    }
    .questionnaire-form {
      flex: 1;
      overflow-y: auto;
    }
    .questionnaire-title {
      input {
        text-align: center;
        &::-ms-input-placeholder,
        &::-webkit-input-placeholder {
          text-align: center;
        }
      }
    }
    .questionnaire-question {
      .delete-block {
        position: fixed;
        top: 0px;
        left: -1px;
        width: 65px;
        height: 100%;
        padding-top: 60px;
        z-index: 9999;
        display: none;
      }
      &.dragging .delete-block {
        display: block;
        &__content {
          height: 100%;
          background-color: #f44336;
          color: #ffffff;
          text-align: center;
          vertical-align: middle;
          font-size: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          i {
            display: inline-block;
            vertical-align: middle;
          }
          .sortable-ghost {
            display: none;
          }
        }
      }
    }
    .questionnaire-random {
      font-size: 14px;
      color: #606266;
    }
    .questionnaire-button {
      box-sizing: initial;
    }
  }
  .random-dialog /deep/ .el-dialog__footer {
    text-align: left;
  }
}
</style>
