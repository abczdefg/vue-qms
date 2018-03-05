<template>
  <qnr-question :data="data"></qnr-question>
</template>
<script>
import qnrRadio from './Radio.vue';
import qnrCheckbox from './Checkbox.vue';
import qnrMatrixRadio from './MatrixRadio.vue';
export default {
  components: {
    'qnr-radio': qnrRadio,
    'qnr-checkbox': qnrCheckbox,
    'qnr-matrix-radio': qnrMatrixRadio,
    'qnr-question': {
      render(h) {
        let self = this;
        let component;
        switch (this.data.type) {
          case 'radio':
            component = qnrRadio;
            break;
          case 'checkbox':
            component = qnrCheckbox;
            break;
          case 'matrix-radio':
            component = qnrMatrixRadio;
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
