<template>
  <card class="question-card">
    <div class="card-header" slot="header">
      <span class="question-number" v-if="index > 0">{{index}}</span>
      <span class="question-title">{{title}}</span>
      <div class="question-detail" v-if="detail" v-html="detail"></div>
    </div>
    <div class="card-content" slot="content">
      <slot name="content"></slot>
    </div>
  </card>
</template>
<script>
import { Card } from 'vux'
export default {
  name: 'qnr-radio',
  components: {
    Card
  },
  props: {
    index: {
      type: Number,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    detail: String
  },
  data() {
    return {}
  },
  methods: {}
}
</script>
<style scoped>

.question-card {
  margin-bottom: 10px;
  border-left: 1px solid #E5E5E5;
  border-right: 1px solid #E5E5E5;
  box-shadow: 0 1px 6px rgba(0, 0, 0, .3);
}
.question-card.error {
  border: 1px solid #f44336;
  box-shadow: 0 1px 6px rgba(244, 67, 54, .3);
}
.question-card .question-number {
  margin-right: 2px;
}

.question-card .question-number:after {
  content: '.';
}

.question-card >>> .card-header {
  position: relative;
  padding: 10px 15px;
  font-size: 18px;
  line-height: 24px;
}

.question-card >>> .card-content {
  border-top: 1px solid #E5E5E5;
}

.question-card >>> .weui-cells {
  /*margin-top: 0;*/
}

.question-card >>> .weui-cells:before {
  display: none;
}

.question-card >>> [class^="weui-icon-"],
.question-card >>> [class*=" weui-icon-"] {
  font-family: "iconfont";
}

</style>
