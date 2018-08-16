<template>
  <div class="question-content">
    <div class="question-title"><span v-if="data.index > 0">{{data.index}}. </span>{{data.title}}</div>
    <div class="question-detail">
      <table class="matrix-radio-table">
        <thead>
          <tr>
            <th></th>
            <th v-for="(column, j) in data.choice">{{column.content}}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, i) in data.subquestion">
            <th scope="row">{{row.content}}</th>
            <td v-for="(column, j) in data.choice">
              <input type="radio" disabled>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
import BaseContent from '../BaseContent'
export default {
  extends: BaseContent
}
</script>
<style lang="less" scoped>
.matrix-radio-table {
  @border-width: 1px;
  @border-color: #dcdfe6;
  font-size: 11px;
  color: #333333;
  border-width: @border-width;
  border-color: @border-color;
  border-collapse: collapse;
  font-size: 14px;
  vertical-align: middle;
  text-align: center;
  th,
  td {
    border-width: @border-width;
    padding: 14px;
    border-style: solid;
    border-color: @border-color;
    font-weight: normal;
  }
}
</style>
