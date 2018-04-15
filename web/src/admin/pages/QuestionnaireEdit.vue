<template>
  <div class="questionnaire-detail-container">
    <ul class="question-type-container">
      <li class="question-type-item" v-for="(item, type) in questionManager" :key="type" @click="addQuestion(type)">
        <el-button plain class="question-type-button">{{item.title}}</el-button>
      </li>
    </ul>
    <div class="questionnaire-form-container">
      <el-form class="questionnaire-form" :model="questionnaireForm" ref="questionnaireForm" :rules="questionnaireRules" label-position="left" label-width="0">
        <el-form-item class="questionnaire-title" prop="title">
          <el-input v-model="questionnaireForm.title" placeholder="请输入问卷标题"></el-input>
        </el-form-item>
        <el-form-item class="questionnaire-introduction" prop="introduction">
          <el-input type="textarea" :autosize="{minRows:3}" v-model="questionnaireForm.introduction" placeholder="请输入问卷介绍"></el-input>
        </el-form-item>
        <div class="questionnaire-question-list" :class="{dragging: dragging}">
          <div class="question-delete-block-container">
            <draggable id="question-delete-block" class="question-delete-block" :options="dragDeleteOptions">
              <i class="el-icon-delete"></i>
            </draggable>
          </div>
          <draggable class="questionnaire-question-list" :class="{dragging: dragging}" v-model="questionnaireForm.question" :options="dragQuestionOptions" @start="dragStart" @end="dragEnd">
            <component
              v-for="(item, index) in questionnaireForm.question"
              :is="`qnr-${item.type}`"
              :class="{draggable:!disableDraggable}"
              :key="item.index"
              :data="item"
              v-on:update:data="data=>updateQuestion(index, data)"
              @delete="deleteQuestion(index)"
            >
            </component>
          </draggable>
        </div>
        <!-- <el-form-item class="questionnaire-random" prop="random" label-width="80px" label="随机化">
          <el-switch v-model="questionnaireForm.random" :active-value="true" :inactive-value="false"></el-switch>
        </el-form-item> -->
      </el-form>
      <div class="questionnaire-button">
        <el-button type="primary" size="small" @click="saveQuestionnaire('questionnaireForm')">保存问卷</el-button>
        <el-button type="danger" size="small" @click="cancelQuestionnaire">取消编辑</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import Draggable from 'vuedraggable'
import { getQuestionnaire, updateQuestionnaire, addQuestionnaire } from '@admin/api';
import { QnrRadio, QnrCheckbox, QnrMatrixRadio, QnrPicker, QnrFillblank, questionManager } from '@admin/components/question/index.js';
export default {
  components: {
    QnrRadio,
    QnrCheckbox,
    QnrMatrixRadio,
    QnrPicker,
    QnrFillblank,
    Draggable
  },
  data() {
    return {
      questionnaireForm: {
        title: '',
        introduction: '',
        question: [],
        random: false
      },
      questionnaireRules: {
        title: [
          { required: true, message: '请输入问卷名', trigger: 'blur' }
        ],
        introduction: [
          { required: true, message: '请输入问卷介绍', trigger: 'blur' }
        ]
      },
      questionManager: questionManager,
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
      }
    }
  },
  created() {
    if(this.$route.params.action === 'edit') {
      this.getQuestionnaire(this.$route.params.id);
    }
  },
  mounted() {
    // this.$store.dispatch('hideSidebar');
  },
  beforeDestroy() {
    this.$store.dispatch('showSidebar');
  },
  watch: {
    disableDraggable(val) {
      this.dragDeleteOptions.disabled = val;
      this.dragQuestionOptions.disabled = val;
    }
  },
  computed: {
    disableDraggable() {
      return this.$store.state.questionnaire.isEditing;
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
      this.questionnaireForm.question.splice(index, 1, data);
    },
    addQuestion(type) {
      if(this.checkEditing()) {
        return;
      }
      this.questionnaireForm.question.push(questionManager[type]);
      // this.questionnaireForm.question.push({ type });
      this.$nextTick(() => this.scrollToBottom());
    },
    deleteQuestion(index) {
      if(this.checkEditing()) {
        return;
      }
      this.$confirm('确认删除问题？').then(
        () => this.questionnaireForm.question.splice(index, 1)
      ).catch(err => err);
    },
    getQuestionnaire(id) {
      getQuestionnaire({id}).then(
        res => this.questionnaireForm = this.addIndex(res.data)
      ).catch(
        err => this.$message.error(`获取问卷失败：${err.message}`)
      )
    },
    addIndex(data) {
      data.question.map((v, i) => v.index = i + 1);
      return data;
    },
    saveQuestionnaire(formName) {
      if(this.checkEditing()) {
        return;
      }
      this.$refs[formName].validate().then(
        valid => {
          this.questionnaireForm.id = this.$route.params.id;
          if(this.$route.params.action === 'edit') {
            this.questionnaireForm.update_time = new Date();
            this.editQuestionnaire();
          } else if(this.$route.params.action === 'add') {
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
<style scoped>
.questionnaire-detail-container {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  flex: 1;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  flex-direction: row;
  overflow-y: hidden;
}
.question-type-container {
  width: 150px;
  padding: 10px;
  border-right: 1px solid #e0e0e0;
  text-align: center;
}
.question-type-container .question-type-item {
  margin-bottom: 10px;
}
.question-type-container .question-type-button {
  width: 100%;
  padding: 10px;
}
.questionnaire-form-container {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.questionnaire-form {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  border-bottom: 1px solid #e0e0e0;
}
.questionnaire-title input::-ms-input-placeholder {
  text-align: center;
}

.questionnaire-title input::-webkit-input-placeholder {
  text-align: center;
}

.questionnaire-title input {
  text-align: center;
}

.questionnaire-question-list {
  margin-bottom: 22px;
}

.questionnaire-question-list .question-delete-block-container {
  position: fixed;
  top: 0px;
  left: -1px;
  width: 65px;
  height: 100%;
  padding-top: 60px;
  z-index: 9999;
  display: none;
}
.questionnaire-question-list.dragging .question-delete-block-container {
  display: block;
}

.questionnaire-question-list .question-delete-block {
  height: 100%;
  background-color: #f44336;
  color: #ffffff;
  text-align: center;
  vertical-align: middle;
  font-size: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.questionnaire-question-list .question-delete-block > * {
  /*display: none;*/
}

.questionnaire-question-list .question-delete-block i {
  display: inline-block;
  vertical-align: middle;
}
.questionnaire-button {
  padding: 10px;
  box-sizing: initial;
}
</style>
