<template>
  <div class="question-content">
    <div class="question-title">{{data.title}}</div>
    <div class="question-detail">
      <div class="question-checkbox-item" v-for="item in data.choice">
        <el-checkbox :label="item.content"></el-checkbox>
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
.question-checkbox-item {
  margin-bottom: 10px;
}
.question-checkbox-item:last-child {
  margin-bottom: 0;
}
</style>
