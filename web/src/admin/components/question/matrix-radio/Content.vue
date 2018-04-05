<template>
  <div class="question-content">
    <div class="question-title">{{data.title}}</div>
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
export default {
  props: {
    data: {}
  },
  data() {
    return {

    }
  },
  mounted() {
  },
  methods: {

  }
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
table.matrix-radio-table {
  font-size: 11px;
  color: #333333;
  border-width: 1px;
  border-color: #dcdfe6;
  border-collapse: collapse;
  font-size: 14px;
  vertical-align: middle;
  text-align: center;
}

table.matrix-radio-table th {
  border-width: 1px;
  padding: 14px;
  border-style: solid;
  border-color: #dcdfe6;
  font-weight: normal;
}
table.matrix-radio-table td {
  border-width: 1px;
  padding: 14px;
  border-style: solid;
  border-color: #dcdfe6;
}
</style>
