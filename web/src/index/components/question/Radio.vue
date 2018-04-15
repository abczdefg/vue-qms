<template>
  <base-question :index="question.index" :title="question.title" :detail="question.detail">
    <group gutter="0" label-align="left" slot="content">
      <radio label-position="left" :options="options" v-model="currentValue"></radio>
    </group>
  </base-question>
</template>
<script>
import BaseQuestion from '@index/components/question/Base.vue'
import { Group, Radio } from 'vux'
export default {
  name: 'qnr-radio',
  components: {
    BaseQuestion,
    Group,
    Radio
  },
  props: {
    question: {
      type: Object,
      default() {
        return {
          type: 'radio',
          choice: []
        };
      },
      required: true,
      validator(val) {
        return val.type === 'radio' && Array.isArray(val.choice);
      }
    },
    value: [Number, String]
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
  computed: {
    options() {
      return this.question.choice.map(item => {
        return {
          value: item.content,
          key: item.content
        }
      });
    }
  },
  data() {
    return {
      currentValue: this.value
    };
  },
  methods: {
    validate() {
      const value = this.value;
      const index = this.index;
      return ((typeof value === 'string' || typeof value === 'number') && value !== '') ? true : `题目${index}未完成`;
    }
  }
}
</script>
<style scoped>
/* radio */
.question-card>>>.weui-cells_radio .weui-cell__ft {
  padding-right: 0.35em;
  padding-left: 0;
}

.question-card>>>.weui-cells_radio .weui-check__label:active {
  background-color: transparent;
}

.question-card>>>.weui-cells_radio .weui-check+.weui-icon-checked:before {
  content: '\e6d7';
  font-size: 23px;
}

.question-card>>>.weui-cells_radio .weui-check:checked+.weui-icon-checked:before {
  content: '\e75b';
  color: #03a9f4;
}
</style>
