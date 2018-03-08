<template>
  <qnr-question :data="data"></qnr-question>
</template>
<script>
import qnrRadio from './Radio.vue';
import qnrCheckbox from './Checkbox.vue';
import qnrMatrixRadio from './MatrixRadio.vue';
export default {
  components: {
    'qnr-radio': QnrRadio,
    'qnr-checkbox': QnrCheckbox,
    'qnr-matrix-radio': QnrMatrixRadio,
    'qnr-question': {
      render(h) {
        let self = this;
        let component;
        switch (this.data.type) {
          case 'radio':
            component = QnrRadio;
            break;
          case 'checkbox':
            component = QnrCheckbox;
            break;
          case 'matrix-radio':
            component = QnrMatrixRadio;
            break;
        }
        return h(component, {
          props: {
            data: this.data,
          },
          on: {
            "update:data": this.$parent.updateQuestionData
          }
        });
      },
      props: ['data']
    }
  },
  props: {
    data: {
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      isEditing: false,
    }
  },
  methods: {
    updateQuestionData(data) {
      this.$emit('update:data', data);
    }
  }
}
</script>
