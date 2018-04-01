<template>
  <div class="question-content">
    <div class="question-title">{{data.title}}</div>
    <div class="question-detail">
      <el-select :value="data.defaultSelectedValue[0]" placeholder="请选择">
        <el-option v-for="(item, i) in data.list[0]" :key="i" :label="item" :value="i"></el-option>
      </el-select>
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

</style>
