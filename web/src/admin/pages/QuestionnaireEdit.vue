<template>
  <div class="questionnaire-edit-container">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>问卷管理</el-breadcrumb-item>
        <el-breadcrumb-item>问卷编辑</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="question-edit-content">
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
            <draggable id="question-delete-block" class="question-delete-block" :options="dragDeleteOptions">
              <i class="el-icon-delete"></i>
            </draggable>
            <draggable class="questionnaire-question-list" :class="{dragging: dragging}" v-model="questionnaireForm.question" :options="dragQuestionOptions" @start="dragStart" @end="dragEnd">
              <component
                v-for="(item, index) in questionnaireForm.question"
                :is="`qnr-${item.type}`"
                :class="{draggable:!disableDraggable}"
                :key="index"
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
          <el-button type="primary" @click="saveQuestionnaire('questionnaireForm')">保存问卷</el-button>
          <el-button type="danger" @click="cancelQuestionnaire">取消编辑</el-button>
        </div>
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
    this.$store.dispatch('hideSidebar');
  },
  destroyed() {
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
      return this.$store.state.isEditing;
    }
  },
  methods: {
    checkEditing() {
      if(this.$store.state.isEditing) {
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
      this.$confirm('确认删除问题？').then(() => this.questionnaireForm.question.splice(index, 1))
    },
    getQuestionnaire(id) {
      getQuestionnaire({id}).then(
        res => this.questionnaireForm = res.data
      ).catch(
        err => this.$message.error(`获取问卷失败：${err.message}`)
      )
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
      let inH = document.querySelector('.questionnaire-form').offsetHeight;
      document.querySelector('.questionnaire-form-container').scrollTop = inH;
    }
  }
}

</script>
<style scoped>
.questionnaire-edit-container {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 140px);
}
.crumbs {
  margin-bottom: 24px;
}
.question-edit-content {
  display: flex;
  flex: 1;
  max-height: 100%;
}
.question-type-container {
  width: 150px;
  border-right: 1px solid #e0e0e0;
  text-align: center;
}
.question-type-container .question-type-item {
  padding: 0 10px;
  margin-bottom: 10px;
}
.question-type-container .question-type-button {
  width: 100%;
}
.questionnaire-form-container {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.questionnaire-form {
  padding: 0 10px;
  overflow-y: auto;
  padding-bottom: 10px;
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

.questionnaire-question-list .question-delete-block {
  position: fixed;
  top: 60px;
  left: -1px;
  width: 65px;
  height: calc(100vh - 60px);
  background-color: #f44336;
  color: #ffffff;
  font-size: 36px;
  vertical-align: middle;
  justify-content: center;
  align-items: center;
  display: none;
  z-index: 9999;
}

.questionnaire-question-list.dragging .question-delete-block {
  display: flex;
}

.questionnaire-question-list .question-delete-block > * {
  display: none;
}

.questionnaire-question-list .question-delete-block i {
  display: inline-block;
  vertical-align: middle;
}
.questionnaire-button {
  padding: 10px 10px 0;
}
</style>
