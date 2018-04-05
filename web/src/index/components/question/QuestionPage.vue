<template>
  <div class="question-page-container">
    <template v-for="(question, index) in pageData">
      <compoent :is="`qnr-${question.type}`" :ref="`question`" :question="question" :index="index + 1" v-model="currentValue[index]"></compoent>
    </template>
  </div>
</template>
<script>
import {  QnrRadio, QnrCheckbox, QnrMatrixRadio, QnrPicker, QnrFillblank } from '@index/components/question';
export default {
  components: {
    QnrRadio,
    QnrCheckbox,
    QnrMatrixRadio,
    QnrPicker,
    QnrFillblank,
  },
  props: {
    pageData: {
      type: Array,
      default: () => []
    },
    value: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    value(newVal) {
      this.currentValue = newVal;
    },
    currentValue(newVal) {
      this.$emit('on-change', newVal);
      this.$emit('input', newVal);
    }
  },
  mounted() {

  },
  data() {
    return {
      currentValue: this.value
    }
  },
  methods: {
    validate() {
      let question = this.$refs.question;
      for(let [i, val] of Object.entries(this.currentValue)) {
        let result = question[i].validate();
        if(result !== true) {
          this.$vux.toast.text(result);
          return false;
        }
      }
      return true;
    }
  }
}
</script>
