<template>
  <div class="question-content">
    <div class="question-title"><span v-if="data.index > 0">{{data.index}}. </span>{{data.title}}</div>
    <div class="question-detail">
      <el-select :value="data.defaultSelectedValue[0]" placeholder="请选择">
        <el-option v-for="(item, i) in data.list[0]" :key="i" :label="item" :value="i"></el-option>
      </el-select>
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
</style>
