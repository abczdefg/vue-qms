<template>
  <base-question :index="index" :title="question.title" :detail="question.detail">
    <group gutter="0" label-align="left" slot="content">
        <x-address title="点击选择" :list="addressData" v-model="currentValue"></x-address>
    </group>
  </base-question>
</template>
<script>
import BaseQuestion from './Base'
import { Group, XAddress, ChinaAddressV4Data, Value2nameFilter, Name2valueFilter } from 'vux'
export default {
  components: {
    BaseQuestion,
    Group,
    XAddress
  },
  props: {
    index: {
      type: Number,
      required: true
    },
    question: {
      type: Object,
      default() {
        return {
          type: 'address',
          list: []
        };
      },
      required: true,
      validator(val) {
        return val.type === 'address';
      }
    },
    value: Array
  },
  watch: {
    value(newVal, oldVal) {
      if(this.isSame(newVal, oldVal)) {
        return;
      }
      this.currentValue = this.nameToValue(newVal);
    },
    currentValue(newVal, oldVal) {
      if(this.isSame(newVal, oldVal)) {
        return;
      }
      this.$emit('on-change', this.valueToName(newVal));
      this.$emit('input', this.valueToName(newVal));
    }
  },
  data() {
    return {
      currentValue: this.nameToValue(this.value),
      addressData: ChinaAddressV4Data
    };
  },
  methods: {
    valueToName(val) {
      return Value2nameFilter(val, ChinaAddressV4Data).split(/\s+/);
    },
    nameToValue(val) {
      return Name2valueFilter(val, ChinaAddressV4Data).split(/\s+/);
    },
    isSame(arr1, arr2) {
      if(!Array.isArray(arr1) && !Array.isArray(arr2)) {
        return false;
      }
      let len1 = arr1.length;
      let len2 = arr2.length;
      if(len1 !== len2) {
        return false;
      }
      for(var i = 0; i < len1; i++){
        if(arr1[i] !== arr2[i]) {
          return false;
        }
      }
      return true;
    },
    validate() {
      return this.value.length > 0 ? true : `题目${this.index}未完成`;
    }
  }
}
</script>
<style scoped>

</style>
