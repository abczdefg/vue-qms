<template>
  <div class="question-item" :class="{editing:isEditorOpen}">
    <div class="question-item-content" v-if="!isEditorOpen">
      <component
        :is="`${data.type}-content`"
        :data="data"
      >
      </component>
      <div class="question-control">
        <el-button type="white" icon="el-icon-edit" size="mini" @click="showEditor">编辑</el-button>
        <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteHandler">删除</el-button>
      </div>
    </div>
    <div class="question-item-editor" v-else>
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
import Radio from '@admin/components/question/radio'
import Checkbox from '@admin/components/question/checkbox'
import Fillblank from '@admin/components/question/fillblank'
import MatrixRadio from '@admin/components/question/matrix-radio'
import Picker from '@admin/components/question/picker'
const {
  Content: RadioContent,
  Editor: RadioEditor,
  defaultValue: RadioDefault,
} = Radio;
const {
  Content: CheckboxContent,
  Editor: CheckboxEditor,
  defaultValue: CheckboxDefault,
} = Checkbox;
const {
  Content: FillblankContent,
  Editor: FillblankEditor,
  defaultValue: FillblankDefault,
} = Fillblank;
const {
  Content: MatrixRadioContent,
  Editor: MatrixRadioEditor,
  defaultValue: MatrixRadioDefault,
} = MatrixRadio;
const {
  Content: PickerContent,
  Editor: PickerEditor,
  defaultValue: PickerDefault,
} = Picker;
const defaultValue = ((questions) => {
  let result = {};
  for(let item of questions) {
    result[item.type] = item;
  }
  return result;
})([RadioDefault, CheckboxDefault, FillblankDefault, MatrixRadioDefault, PickerDefault]);
export default {
  components: {
    RadioContent,
    RadioEditor,
    CheckboxContent,
    CheckboxEditor,
    FillblankContent,
    FillblankEditor,
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
  },
  getDefault(type) {
    return defaultValue[type];
  },
  getAllDefault() {
    return defaultValue;
  },
  getAllType() {
    return Object.values(defaultValue)
      .map(({title, type}) => ({title, type}));
  }
}
</script>
<style lang="less" scoped>
.question-item {
  position: relative;
  padding: 30px 10px;
  border: 1px solid #ffffff;
  background: #ffffff;
  &.editing,
  &:hover {
    border-color: #e0e0e0;
    background: #fafafa;
  }
  &.draggable {
    cursor: move;
  }
  &-content {
    display: flex;
    flex-direction: column;
    align-items: start;
    justify-content: space-between;
    .question-control {
      visibility: hidden;
    }
    &:hover .question-control {
      visibility: visible;
    }
  }
}
</style>
