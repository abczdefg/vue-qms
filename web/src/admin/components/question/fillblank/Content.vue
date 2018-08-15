<template>
  <div class="question-content">
    <div class="question-title"><span v-if="data.index > 0">{{data.index}}. </span>{{data.title}}</div>
    <div class="question-detail">
      <div class="fillblank-content" v-html="data.content"></div>
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
.question-title,
.question-detail {
  margin-bottom: 10px;
  color: #606266;
  font-size: 14px;
}
</style>
