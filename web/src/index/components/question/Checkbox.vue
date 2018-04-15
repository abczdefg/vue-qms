<template>
  <base-question :index="question.index" :title="question.title" :detail="question.detail">
    <group gutter="0" label-align="left" slot="content">
        <checklist label-position="left" :options="options" v-model="currentValue"></checklist>
    </group>
  </base-question>
</template>
<script>
import BaseQuestion from '@index/components/question/Base.vue'
import { Group, Checklist } from 'vux'
export default {
  components: {
    BaseQuestion,
    Group,
    Checklist
  },
  props: {
    question: {
      type: Object,
      default() {
        return {
          type: 'checkbox',
          choice: []
        };
      },
      required: true,
      validator(val) {
        return val.type === 'checkbox' && Array.isArray(val.choice);
      }
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
      return this.value.length > 0 ? true : `题目${this.index}未完成`;
    }
  }
}

</script>
<style scoped>
/* checkbox */

.question-card>>>[class^="weui-icon-"],
.question-card>>>[class*=" weui-icon-"] {
  font-family: "iconfont";
}

.question-card>>>.weui-cells_checkbox .weui-icon-checked:before {
  content: '\e6d5';
}

.question-card>>>.weui-cells_checkbox .weui-check:checked+.weui-icon-checked:before {
  content: '\e6d4';
  color: #03a9f4;
}

</style>
