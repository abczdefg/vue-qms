<template>
  <qnr-base>
    <template slot="content">
      <qnr-content :data="data"></qnr-content>
    </template>
    <template slot="editor">
      <el-form :model="editorData" ref="editorData" label-position="left" label-width="80px">
        <el-form-item class="question-input" :rules="questionRules" prop="title" label="题目">
          <el-input v-model="editorData.title" placeholder="请输入题目"></el-input>
        </el-form-item>
        <el-form-item class="choice-input" v-for="(item, i) in editorData.choice" :key="i" :rules="choiceRules" :prop="'choice[' + i + '].content'" :label="'选项'+(i+1)">
          <el-input size="small" v-model="item.content" placeholder="请输入选项"></el-input>
          <el-button @click.prevent="deleteChoice(i)" size="small">删除</el-button>
        </el-form-item>
        <el-form-item>
          <el-button size="small" @click="addChoice">添加选项</el-button>
        </el-form-item>
      </el-form>
    </template>
  </qnr-base>
</template>
<script>
import QnrBase from '@admin/components/question/Base.vue'
import QnrContent from '@admin/components/question/checkbox/Content.vue'
export default {
  components: {
    QnrBase,
    QnrContent
  },
  props: {
    data: {}
  },
  data() {
    return {
      rules: {
        minChoice: 1
      },
      questionRules: { required: true, message: '题目内容不能为空', trigger: 'blur' },
      choiceRules: { required: true, message: '选项内容不能为空', trigger: 'blur' },
      editorData: {}
    }
  },
  mounted() {
    this.resetData();
  },
  methods: {
    resetData: function() {
      this.editorData = JSON.parse(JSON.stringify(this.data));
    },
    hideEditor() {
      this.resetData();
      this.$emit("hide:editor");
    },
    saveEditor(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$emit('update:data', this.editorData);
          this.hideEditor();
        }
      });
    },
    addChoice() {
      this.editorData.choice.push({
        content: ""
      });
    },
    deleteChoice(index) {
      let choice = this.editorData.choice;
      let minChoice = this.rules.minChoice;
      if(choice.length <= minChoice) {
        this.$message(`选项数目至少为${minChoice}`);
      } else {
        choice.splice(index, 1);
      }
    },
    saveEditor() {
      this.$emit('update:data', this.editorData);
    },
    validate() {
      return this.$refs.editorData.validate();
    }
  }
}
</script>
<style>
.choice-input .el-input {
  width: 60%;
}
</style>
