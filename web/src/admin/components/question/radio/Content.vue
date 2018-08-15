<template>
  <div class="question-content">
    <div class="question-title"><span v-if="data.index > 0">{{data.index}}. </span>{{data.title}}</div>
    <div class="question-detail">
      <div class="question-radio-item" v-for="item in data.choice">
        <el-radio :label="item.content"></el-radio>
      </div>
    </div>
  </div>
</template>
<script>
import BaseContent from '../BaseContent'
export default {
  extends: BaseContent
}
</script>
<style scoped>
.question-title {
  margin-bottom: 10px;
  color: #606266;
  font-size: 14px;
}
.question-detail {
  margin-bottom: 10px;
}
.question-radio-item {
  margin-bottom: 10px;
}
.question-radio-item:last-child {
  margin-bottom: 0;
}
.choice-input .el-input {
  width: 60%;
}
</style>
