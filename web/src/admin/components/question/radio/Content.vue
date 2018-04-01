<template>
  <div class="question-content">
    <div class="question-title">{{data.title}}</div>
    <div class="question-detail">
      <div class="question-radio-item" v-for="item in data.choice">
        <el-radio :label="item.content"></el-radio>
      </div>
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
<style>
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
