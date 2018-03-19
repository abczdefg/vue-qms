<template>
  <base-question :index="index" :title="question.title" :detail="question.detail">
    <template slot="content">
      <div class="fillblank-content">
        <template v-for="(item, i) in content">
          <span v-if="i % 2 === 0">{{item}}</span>
          <input v-else v-model="currentValue[Math.floor(i/2)]" :id="item.id" class="blank" :style="{ width: item.length * 17 + 'px' }">
        </template>
      </div>
    </template>
  </base-question>
</template>
<script>
import BaseQuestion from './Base'
export default {
  name: 'qnr-fill-blank',
  components: {
    BaseQuestion
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
          type: 'fillblank',
          blank: []
        };
      },
      required: true,
      validator(val) {
        return val.type === 'fillblank' && Array.isArray(val.blank);
      }
    },
    value: Array
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
    let len = this.question.blank.length
    if(!Array.isArray(this.value) || this.value.length !== len) {
      this.currentValue = new Array(len).fill(null);
    }
  },
  computed: {
    content() {
      return this.transformToBlankArray(this.question.content);
    }
  },
  data() {
    return {
      currentValue: this.value
    };
  },
  methods: {
    validate() {
      for(let i = 0; i < this.question.blank.length; i++) {
        // i根据blank的长度遍历
        if(this.currentValue[i] === null || this.currentValue[i] === undefined) {
          return `题目${this.index}未完成`;
        }
      }
      return true;
    },
    transformToBlankArray(html) {
      let result;
      let reg = /(<span[^>]*id=".+?"[^>]*?>.*?<\/span>)/g;
      let htmlArr = html.split(reg);
      for(let i = 1, val = htmlArr[i]; i < htmlArr.length; i += 2) {
        let reg = /<span[^>]*id="(.+?)"[^>]*?>(.*?)<\/span>/g;
        let ret = reg.exec(val);
        htmlArr[i] = {
          id: ret[1],
          length: ret[2].length
        };
      }
      return htmlArr;
    }
  }
}
</script>
<style scoped>
.question-card .fillblank-content {
  padding: 10px 15px;
  line-height: 24px;
  font-size: 17px;
}
.question-card .fillblank-content .blank {
  display: inline-block;
  -webkit-appearance: none;
  background-color: transparent;
  border: none;
  border-radius: 0;
  outline: none;
  position: relative;
  z-index: 1;
  border-bottom: 1px solid #000000;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
  margin-left: 2px;
  margin-right: 2px;
  padding: 1px 5px;
}
</style>
