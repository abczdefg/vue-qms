<template>
  <div class="question-editor">
    <el-form :model="editorData" :ref="formName" label-position="left" label-width="80px">
      <el-form-item class="question-input" :rules="questionRules" prop="title" label="题目">
        <el-input v-model="editorData.title" placeholder="请输入题目"></el-input>
      </el-form-item>
      <el-form-item ref="title-item" class="content-input" :rules="contentRules" prop="content" label="内容">
        <div class="fillblank">
          <div class="fillblank-content" contenteditable="true" v-html="editorData.content"></div>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import BaseEditor from '../BaseEditor'
export default {
  extends: BaseEditor,
  data() {
    let contentValidator = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('内容不能为空'));
      } else {
        let reg = /(<span[^>]*id=".+?"[^>]*?>.*?<\/span>)/g;
        if(!reg.test(value)) {
          callback(new Error('至少要有一个填空'));
        }
      }
      callback();
    }
    return {
      questionRules: { required: true, message: '题目不能为空', trigger: 'blur' },
      contentRules: { required: true, validator: contentValidator, trigger: 'blur' },
      lastEditRange: ''
    }
  },
  methods: {
    handleKeydown(e) {
      if (parseInt(e.keyCode, 10) === 13) {
        e.preventDefault();
      }
    },
    handleBlur(e) {
      let blankText = this.transformBlankText(e.target.innerText);
      this.setEditorData(blankText);
      this.$refs['title-item'].validate('blur');
    },
    handlePaste(e) {
      e.preventDefault();
      let text = null;
      if (window.clipboardData && clipboardData.setData) {
        text = window.clipboardData.getData('text');
      } else {
        text = (e.originalEvent || e).clipboardData.getData('text/plain');
      }
      document.execCommand("insertText", false, text);
    },
    transformBlankText(text) {
      let i = 0;
      text = text.replace(/<(style|script|iframe)[^>]*?>[\s\S]+?<\/\1\s*>/gi, '').replace(/<[^>]+?>/g, '').replace(/\s+/g, ' ').replace(/ /g, ' ').replace(/>/g, ' ');
      text = text.replace(/(_{2,})/g, ($0, $1) => `<span id="blank-${i++}" class="blank">${$1}</span>`);
      return text;
    },
    setEditorData(html) {
      let reg = /<span[^>]*id="(.+?)"[^>]*?>/g;
      let blank = [];
      let result;
      while ((result = reg.exec(html)) !== null) {
        blank.push(result[1]);
      }
      this.editorData.content = html;
      this.editorData.blank = blank;
    }
  }
}

</script>
<style scoped>
.content-input .editorLabel {
  width: 80px;
}

.content-input .fillblank-content {
  vertical-align: top;
  -webkit-appearance: none;
  background-color: #fff;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  color: #606266;
  display: inline-block;
  line-height: 1;
  outline: 0;
  padding: 12px 15px;
  -webkit-transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
  transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
  width: 100%;
  font-size: 14px;
  line-height: 16px;
  word-break: break-all;
}

.content-input.is-error .fillblank-content {
  border-color: #f56c6c;
}

.content-input.is-success .fillblank-content {
  border-color: #67c23a;
}
</style>
