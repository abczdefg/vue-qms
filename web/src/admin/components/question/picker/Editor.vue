<template>
  <div class="question-editor">
    <el-form :model="editorData" :ref="formName" label-position="left" label-width="80px">
      <el-form-item class="question-input" :rules="questionRules" prop="title" label="题目">
        <el-input v-model="editorData.title" placeholder="请输入题目"></el-input>
      </el-form-item>
      <el-form-item class="choice-input" prop="defaultSelectedValue" label="默认选项">
        <el-input size="small" v-model="editorData.defaultSelectedValue[0]" placeholder="请输入默认选项"></el-input>
        <el-button @click.prevent="deleteChoice(i)" size="small">删除</el-button>
      </el-form-item>
      <el-form-item class="choice-input" v-for="(item, i) in editorData.list[0]" :key="i" :rules="listRules" :prop="`list[0][${i}]`" :label="`选项${i+1}`">
        <el-input size="small" v-model="editorData.list[0][i]" placeholder="请输入选项"></el-input>
        <el-button @click.prevent="deleteChoice(i)" size="small">删除</el-button>
      </el-form-item>
      <el-form-item>
        <el-button size="small" @click="addChoice">添加选项</el-button>
        <el-button size="small" @click="bulkVisible=true">批量添加</el-button>
      </el-form-item>
    </el-form>
    <el-dialog title="批量添加" :visible.sync="bulkVisible" top="0">
      <el-form label-width="0">
        <el-form-item>
          <el-input type="textarea" v-model="bulkChoice" :rows="10" resize="none" placeholder="批量输入选项，每行作为一个选项"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="bulkVisible=false">取消</el-button>
        <el-button type="primary" @click="bulkSaveChoice">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import BaseEditor from '../BaseEditor'
export default {
  extends: BaseEditor,
  watch: {
    editorData: {
      handler(val) {
        this.bulkChoice = val.list[0].join('\r\n');
      },
      deep: true
    }
  },
  data() {
    return {
      rules: {
        minChoice: 1
      },
      questionRules: { required: true, message: '题目内容不能为空', trigger: 'blur' },
      listRules: { required: true, message: '选项内容不能为空', trigger: 'blur' },
      editorData: { list: [], defaultSelectedValue: [] }, // 避免0  of undefined
      bulkChoice: '',
      bulkVisible: false
    }
  },
  methods: {
    addChoice() {
      this.editorData.list[0].push('');
    },
    deleteChoice(index) {
      this.editorData.list[0].splice(index, 1);
    },
    saveEditor() {
      this.$emit('update:data', this.editorData);
    },
    bulkSaveChoice() {
      let list = this.bulkChoice.split(/\r?\n/);
      this.$set(this.editorData.list, 0, list);
      this.bulkVisible = false;
    }
  }
}

</script>
<style scoped>
.choice-input .el-input {
  width: 60%;
}
</style>
