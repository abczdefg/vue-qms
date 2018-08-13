<template>
  <div class="questionnaire-question-container" :class="{editing:isEditorOpen}">
    <div class="question-container" v-if="!isEditorOpen">
      <component
        :is="`${data.type}-content`"
        :data="data">
      </component>
      <div class="question-control">
        <el-button class="question-control-btn" type="white" icon="el-icon-edit" size="mini" @click="showEditor">编辑</el-button>
        <el-button class="question-control-btn" type="danger" icon="el-icon-delete" size="mini" @click="deleteHandler">删除</el-button>
      </div>
    </div>
    <div class="editor-container" v-else>
      <componenet
        ref="editor"
        :is="`${data.type}-editor`"
        :data="data"
      >
      </componenet>
      <el-button type="primary" size="small" @click="saveEditor">保存</el-button>
      <el-button type="danger" size="small" @click="cancelEditor">取消</el-button>
    </div>
  </div>
</template>
<script>
import RadioContent from '@admin/components/question/radio/Content.vue'
import RadioEditor from '@admin/components/question/radio/Editor.vue'
import CheckboxContent from '@admin/components/question/checkbox/Content.vue'
import CheckboxEditor from '@admin/components/question/checkbox/Editor.vue'
import fillblankContent from '@admin/components/question/fillblank/Content.vue'
import fillblankEditor from '@admin/components/question/fillblank/Editor.vue'
import MatrixRadioContent from '@admin/components/question/matrix-radio/Content.vue'
import MatrixRadioEditor from '@admin/components/question/matrix-radio/Editor.vue'
import PickerContent from '@admin/components/question/picker/Content.vue'
import PickerEditor from '@admin/components/question/picker/Editor.vue'
export default {
  components: {
    RadioContent,
    RadioEditor,
    CheckboxContent,
    CheckboxEditor,
    fillblankContent,
    fillblankEditor,
    MatrixRadioContent,
    MatrixRadioEditor,
    PickerContent,
    PickerEditor
  },
  props: {
    mode: {
      type: String,
      default: 'edit',
      validator(value) {
        return ['add', 'edit'].includes(value);
      }
    },
    data: Object
  },
  data() {
    return {
      isEditing: false
    }
  },
  computed: {
    isAddMode() {
      return this.mode === 'add';
    },
    isEditorOpen() {
      let result = this.isAddMode || this.isEditing;
      this.$store.dispatch('setEditStatus', result);
      return result;
    }
  },
  destroyed() {
    this.$store.dispatch('setEditStatus', false);
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
      this.$refs.editor.getData().then(data => {
        this.$emit('update:data', data);
        this.hideEditor();
      }).catch(err => console.log(err));
    },
    cancelEditor() {
      if(this.isAddMode) {
        this.deleteHandler();
      }
      this.hideEditor();
    },
    deleteHandler() {
      this.$emit('delete:data', this.data);
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
