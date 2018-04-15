<template>
  <base-question :index="question.index" :title="question.title" :detail="question.detail">
    <group gutter="0" label-align="left" slot="content">
        <datetime title="点击选择" :min-year="1949" :max-year="(new Date()).getFullYear()-1" :default-selected-value="defaultSelectedValue" v-model="currentValue"></datetime>
    </group>
  </base-question>
</template>
<script>
import BaseQuestion from '@index/components/question/Base.vue'
import { Group, Datetime } from 'vux'
export default {
  components: {
    BaseQuestion,
    Group,
    Datetime
  },
  props: {
    defaultSelectedValue: {
      type: String,
      default: '1990-01-01'
    },
    question: {
      type: Object,
      default() {
        return {
          type: 'datetime'
        };
      },
      required: true,
      validator(val) {
        return val.type === 'datetime';
      }
    },
    value: {
      type: String,
      default: ''
    }
  },
  watch: {
    value(newVal) {
      this.currentValue = newVal;
    },
    currentValue(newVal) {
      this.$emit('change', newVal);
      this.$emit('input', newVal);
    }
  },
  data() {
    return {
      currentValue: this.value
    };
  },
  methods: {
    validate() {
      return this.value !== '' ? true : `题目${this.index}未完成`;
    }
  }
}
</script>
<style scoped>

</style>
