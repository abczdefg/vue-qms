<template>
  <div class="result-container">
    <el-form>
      <el-form-item>
        <el-button type="danger" icon="el-icon-back" @click="backToQuestionnaireList">返回</el-button>
        <el-button type="primary" icon="el-icon-tickets" @click="detailVisible = true">问卷详情</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="results" border style="width:100%" max-height="400">
      <el-table-column header-align="center" type="index" width="40"></el-table-column>
      <el-table-column v-for="(item, i) in columns" :key="`${item.prop}_${i}`" header-align="center" :prop="item.prop" :label="item.label" :title="item.title" :width="item.width" :renderHeader="renderHeader"></el-table-column>
    </el-table>
    <el-dialog title="问卷详情" :visible.sync="detailVisible">
      <div class="questionnaire-title">标题：{{questionnaireData.title}}</div>
      <div class="questionnaire-introduction">介绍：{{questionnaireData.introduction}}</div>
      <div class="questionnaire-update-time">最后更新时间：{{questionnaireData.update_time}}</div>
      <div class="questionnaire-question-container">
        <ul>
          <li class="question-list" v-for="(item, i) in questionnaireData.question">
            <div class="question-number">{{i + 1}}.</div>
            <component :is="`qnr-${item.type}-content`" :data="item"></component>
          </li>
        </ul>
      </div>
    </el-dialog>
  </div>
</div>

</template>

<script>
import { getResultsByQuestionnaireId } from '@admin/api';
import QnrRadioContent from '@admin/components/question/radio/Content.vue';
import QnrFillblankContent from '@admin/components/question/fillblank/Content.vue';
import QnrCheckboxContent from '@admin/components/question/checkbox/Content.vue';
import QnrPickerContent from '@admin/components/question/picker/Content.vue';
import QnrMatrixRadioContent from '@admin/components/question/matrix-radio/Content.vue';
export default {
  components: {
    QnrRadioContent,
    QnrCheckboxContent,
    QnrMatrixRadioContent,
    QnrPickerContent,
    QnrFillblankContent,
  },
  data() {
    return {
      questionnaireData: {},
      resultData: [],
      detailVisible: false
    }
  },
  created() {
    this.getResultsByQuestionnaireId(this.$route.params.id);
    this.$store.dispatch('hideSidebar');
  },
  beforeDestroy() {
    this.$store.dispatch('showSidebar');
  },
  computed: {
    results() {
      const convertResultData = (data) => {
        return data.length === 0 ? [] : data.map(item => {
          let answers = item.answer;
          for(var i = 0, len = answers.length; i < len; i++){
            item[`answer_${i}`] = answers[i].answer;
          }
          return item;
        });
      }
      return convertResultData(this.resultData);
    },
    columns() {
      // 根据问题列表生成列
      const getColumn = (question) => {
        let column = [{
          prop: 'ip',
          label: 'IP地址'
        }, {
          prop: 'start_time',
          label: '开始时间',
          width: 160
        }, {
          prop: 'end_time',
          label: '完成时间',
          width: 160
        }];
        if(question && question.length !== 0) {
          let questionColumn = question.map((item, i) => {
            return {
              prop: `answer_${i}`,
              label: `${i + 1}. ${item.title}`,
              title: item.title
            };
          })
          column = column.concat(questionColumn);
        }
        return column;
      }
      return getColumn(this.questionnaireData.question);
    }
  },
  methods: {
    getResultsByQuestionnaireId(id) {
      getResultsByQuestionnaireId({id}).then(
        res => {
          let { results, questionnaire } = res.data;
          this.questionnaireData = questionnaire;
          this.resultData = results;
        }
      ).catch(
        err => this.$message.error(`获取问卷结果失败：${err.message}`)
      )
    },
    renderHeader: function(h, { column, $index }) {
      let { question } = this.questionnaireData;
      if(/^answer_(\d+)/.test(column.property)) {
        let questionIndex = RegExp.$1;
        let questionNumber = parseInt(questionIndex, 10) + 1;
        let title = `${questionNumber}. ${question[questionIndex].title}`;
        return h('el-tooltip', {
          props: {
            content: title,
            placement: "bottom"
          }
        }, [
          h('span', {
            attrs: {
              title
            },
            domProps: {
              innerHTML: `问题${questionNumber}`
            }
          })
        ]);
      } else {
        return column.label;
      }
    },
    backToQuestionnaireList() {
      this.$router.push({name: 'questionnaire'})
    }
  }
}
</script>
<style scoped>
.question-list {
  margin: 20px 0;
  display: flex;
  flex-direction: row;
}
.question-list .question-number {
  margin-right: 5px;
}
.result-container >>> .el-dialog__body {
  height: 58vh;
  overflow-y: auto;
}
</style>
