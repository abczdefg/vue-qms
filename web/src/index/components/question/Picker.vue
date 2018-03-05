<template>
  <base-question :index="index" :title="question.title" :detail="question.detail">
    <group gutter="0" label-align="left" slot="content">
      <popup-picker :class="{'hide-value': !hasChangedFlag}" ref="picker" title="点击选择" :data="question.list" @on-change="valueChange" v-model="currentValue"></popup-picker>
    </group>
  </base-question>
</template>
<script>
import BaseQuestion from './Base'
import { Group, PopupPicker } from 'vux'
export default {
  components: {
    BaseQuestion,
    Group,
    PopupPicker
  },
  props: {
    index: Number,
    question: {
      type: Object,
      default() {
        return {
          type: 'picker',
          list: []
        };
      },
      required: true,
      validator(val) {
        return val.type === 'picker' && Array.isArray(val.list);
      }
    },
    value: Array
  },
  created() {
    if(this.value.length > 0) {
      this.hasChangedFlag = true;
    } else {
      this.currentValue = this.question.defaultSelectedValue;
    }
  },
  watch: {
    value(newVal) {
      this.hasChangedFlag = true;
      this.currentValue = newVal;
    },
    currentValue(newVal) {
      if(this.hasChangedFlag) {
        this.$emit('on-change', newVal);
        this.$emit('input', newVal);
      }
    }
  },
  data() {
    return {
      currentValue: this.value,
      hasChangedFlag: false,
      defaultSelectedValue: this.question.defaultSelectedValue
    };
  },
  methods: {
    valueChange(newVal) {
      this.hasChangedFlag = true;
    },
    validate() {
      return this.value.length > 0;
    }
  }
}
</script>
<style scoped>
.question-card .hide-value >>> .vux-popup-picker-value.vux-cell-value {
  visibility: hidden;
}
</style>
