<template>
  <div class="question-content">
    <div class="question-title">{{data.title}}</div>
    <div class="question-detail">
      <div class="fillblank-content" v-html="data.content"></div>
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
