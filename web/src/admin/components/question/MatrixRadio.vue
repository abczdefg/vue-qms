<template>
  <qnr-base>
    <template slot="content">
      <div class="question-title">{{data.title}}</div>
      <div class="question-detail">
        <table class="matrix-radio-table">
          <thead>
            <tr>
              <th></th>
              <th v-for="(column, j) in data.choice">{{column.content}}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, i) in data.subquestion">
              <th scope="row">{{row.content}}</th>
              <td v-for="(column, j) in data.choice">
                <input type="radio" disabled>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>

    <template slot="editor">
      <el-form :model="editorData" ref="editorData" label-position="left" label-width="80px">
        <el-form-item class="question-input" :rules="questionRules" prop="title" label="题目">
          <el-input v-model="editorData.title" placeholder="请输入题目"></el-input>
        </el-form-item>
        <el-form-item class="choice-input" v-for="(item, i) in editorData.choice" :key="'choice-' + i" :rules="choiceRules" :prop="'choice[' + i + '].content'" :label="'选项'+(i+1)">
          <el-input size="small" v-model="item.content" placeholder="请输入选项"></el-input>
          <el-button @click.prevent="deleteChoice(i)" size="small">删除</el-button>
        </el-form-item>
        <el-form-item>
          <el-button size="small" @click="addChoice">添加选项</el-button>
        </el-form-item>
        <el-form-item class="choice-input" v-for="(item, i) in editorData.subquestion" :key="'subquestion-' + i" :rules="subquestionRules" :prop="'subquestion[' + i + '].content'" :label="'问题'+(i+1)">
          <el-input size="small" v-model="item.content" placeholder="请输入选项"></el-input>
          <el-button @click.prevent="deleteSubquestion(i)" size="small">删除</el-button>
        </el-form-item>
        <el-form-item>
          <el-button size="small" @click="addSubquestion">添加问题</el-button>
        </el-form-item>
      </el-form>
    </template>
  </qnr-base>
</template>
<script>
import QnrBase from './Base.vue'
export default {
  components: {
    QnrBase
  },
  props: {
    data: {}
  },
  data() {
    return {
      rules: {
        minChoice: 2,
        minSubquestion: 2
      },
      questionRules: { required: true, message: '题目内容不能为空', trigger: 'blur' },
      choiceRules: { required: true, message: '选项内容不能为空', trigger: 'blur' },
      subquestionRules: { required: true, message: '问题内容不能为空', trigger: 'blur' },
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
      if (choice.length <= minChoice) {
        this.$message(`选项数目至少为${minChoice}`);
      } else {
        choice.splice(index, 1);
      }
    },
    addSubquestion() {
      this.editorData.subquestion.push({
        content: ""
      });
    },
    deleteSubquestion(index) {
      let subquestion = this.editorData.subquestion;
      let minSubquestion = this.rules.minSubquestion;
      if (subquestion.length <= minSubquestion) {
        this.$message(`问题数目至少为${minSubquestion}`);
      } else {
        subquestion.splice(index, 1);
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
table.matrix-radio-table {
  font-size: 11px;
  color: #333333;
  border-width: 1px;
  border-color: #dcdfe6;
  border-collapse: collapse;
  font-size: 14px;
  vertical-align: middle;
  text-align: center;
}

table.matrix-radio-table th {
  border-width: 1px;
  padding: 14px;
  border-style: solid;
  border-color: #dcdfe6;
  font-weight: normal;
}

table.matrix-radio-table td {
  border-width: 1px;
  padding: 14px;
  border-style: solid;
  border-color: #dcdfe6;
}

</style>
