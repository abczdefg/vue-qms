<template>
  <base-question :index="index" :title="question.title" :detail="question.detail">
    <template slot="content">
      <div class="matrix-title matrix-row">
        <div class="matrix-choice matrix-cell" v-for="(choiceItem, choiceIndex) in question.choice">{{choiceItem.content}}</div>
      </div>
      <div class="matrix-content">
        <div class="matrix-subquestion" v-for="(subquestionItem, subquestionIndex) in question.subquestion">
          <div class="matrix-subquestion-title matrix-row">{{index}}-{{subquestionIndex + 1}} {{subquestionItem.content}}</div>
          <div class="matrix-row">
            <div class="matrix-choice matrix-cell" v-for="(choiceItem, choiceIndex) in question.choice">
              <div class="matrix-radio" :class="choiceItem.cls">
                <input :name="`matrix_${index}_${subquestionIndex}`" type="radio" :value="choiceItem.content" v-model="currentValue[subquestionIndex]"/>
                <span class="matrix-choice-label">{{choiceItem.content}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </base-question>
</template>
<script>
import BaseQuestion from './Base'
export default {
  components: {
    BaseQuestion
  },
  props: {
    index: Number,
    question: {
      type: Object,
      default() {
        return {
          type: 'matrix-radio',
          choice: [],
          subquestion: []
        };
      },
      required: true,
      validator(val) {
        return val.type === 'matrix-radio' && Array.isArray(val.choice) && Array.isArray(val.subquestion);
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
    let len = this.question.subquestion.length
    if(!Array.isArray(this.value) || this.value.length !== len) {
      this.currentValue = new Array(len).fill(null);
    }
  },
  computed: {
  },
  data() {
    return {
      currentValue: this.value
    };
  },
  methods: {
    validate() {
      for(let i = 0; i < this.question.subquestion.length; i++) {
        if(this.currentValue[i] === null || this.currentValue[i] === undefined) {
          return i;
        }
      }
      return true;
    }
  }
}
</script>
<style scoped>
/* matrix-radio */

.matrix-row {
  display: flex;
  flex-direction: row;
  padding: 10px 15px;
}

.matrix-title {
  border-bottom: 2px solid #eee;
}

.matrix-content {
  /*max-height: 80vw;*/
  overflow-x: hidden;
  overflow-y: auto;
}

.matrix-cell {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  line-height: 20px;
}

.matrix-subquestion-title {
  flex: 2;
  justify-content: flex-start;
}

.matrix-choice {
  padding: 5px;
  text-align: center;
  position: relative;
}

.matrix-choice .matrix-choice-label {
  position: absolute;
  top: 4px;
  transform: translate(-50%, -100%);
  width: 100px;
  line-height: 12px;
  color: #9e9e9e;
  font-size: 8px;
  visibility: hidden;
}

.matrix-choice input[type='radio']:checked+.matrix-choice-label,
.matrix-choice input[type='checkbox']:checked+.matrix-choice-label {
  visibility: visible;
}

input[type='radio'],
input[type='checkbox'] {
  margin: 0;
}

.matrix-radio,
.matrix-checkbox {
  text-align: center;
}

.matrix-radio input[type='radio'],
.matrix-checkbox input[type='checkbox'] {
  width: 28px;
  /*height: 26px;*/
  border: 0;
  outline: 0 !important;
  background-color: transparent;
  -webkit-appearance: none;
  margin: 0 auto;
}

.matrix-radio input[type='radio']:before,
.matrix-checkbox input[type='checkbox']:before {
  font-family: "iconfont";
  font-size: 28px;
  font-weight: normal;
  line-height: 1;
  text-decoration: none;
  color: #aaaaaa;
  border-radius: 0;
  background: none;
  -webkit-font-smoothing: antialiased;
}

.matrix-radio input[type='radio']:before {
  content: '\e6d7';
}

.matrix-radio input[type='radio']:checked:before {
  content: '\e75b';
}

.matrix-radio.tick input[type='radio']:before {
  content: '\e62f';
}

.matrix-radio.cross input[type='radio']:before {
  content: '\e61a';
}

.matrix-radio.tick input[type='radio']:checked:before {
  color: #4caf50;
}

.matrix-radio.cross input[type='radio']:checked:before {
  color: #f44336;
}

.matrix-radio input[type='radio']:checked:before,
.matrix-checkbox input[type='checkbox']:checked:before {
  color: #03A9F4;
}

.matrix-cell input[type='radio']:before,
.matrix-cell input[type='checkbox']:before {
  font-size: 24px;
}

.matrix-cell input[type='radio'],
.matrix-cell input[type='checkbox'] {
  flex: 1;
  display: flex;
  position: static;
  align-items: center;
  justify-content: center;
  text-align: center;
}
</style>
