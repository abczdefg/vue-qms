<template>
  <div class="questionnaire-question-container">
    <div class="question-container" v-if="!isEditing">
      <slot name="content"></slot>
      <div class="question-control">
        <el-button class="question-control-btn" type="white" icon="el-icon-edit" size="mini" @click="showEditor">编辑</el-button>
      </div>
    </div>
    <div class="editor-container" v-else>
      <slot name="editor"></slot>
      <el-button type="primary" size="small" @click="saveEditor">保存</el-button>
      <el-button type="danger" size="small" @click="hideEditor">取消</el-button>
    </div>
  </div>
</template>
<script>
export default {
  props: {
  },
  data() {
    return {
      isEditing: false
    }
  },
  destroyed() {
    this.$store.dispatch('updateEditStatus', false);
  },
  watch: {
    isEditing(newVal, oldVal) {
      this.$store.dispatch('updateEditStatus', newVal);
    }
  },
  methods: {
    showEditor() {
      if(this.$store.state.questionnaire.isEditing) {
        this.$message.error('存在编辑中的问题');
        return;
      }
      this.isEditing = true;
    },
    hideEditor() {
      this.isEditing = false;
    },
    saveEditor() {
      this.$parent.$refs.editorData.validate().then(valid => {
        console.log(valid)
        if(valid) {
          this.hideEditor();
          this.$parent.saveEditor();
        }
      }).catch(err => console.log(err));
    }
  }
}

</script>
<style scoped>
.questionnaire-question-container {
  position: relative;
  padding: 30px 10px;
  border: 1px solid #ffffff;
  background: #ffffff;
}

.questionnaire-question-container.editing,
.questionnaire-question-container:hover {
  border-color: #e0e0e0;
  background: #fafafa;
}
.questionnaire-question-container.draggable {
  cursor: move;
}
.questionnaire-question-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
.questionnaire-question-container > *:first-child{
  flex: 1;
}
.question-control {
  visibility: hidden;
}
.questionnaire-question-container:hover .question-control {
  visibility: visible;
}
</style>
