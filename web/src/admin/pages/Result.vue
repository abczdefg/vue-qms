<template>
  <div class="result-container">
    <el-form>
      <el-form-item>
        <el-button type="danger" icon="el-icon-back" @click="backToQuestionnaireList">返回</el-button>
        <el-button type="primary" icon="el-icon-tickets" @click="detailVisible = true">问卷详情</el-button>
        <el-button type="success" icon="el-icon-download" @click="downloadExcel">导出excel</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="results" border style="width:100%" max-height="400">
      <el-table-column header-align="center" type="index" width="40"></el-table-column>
      <el-table-column v-for="(item, i) in columns" :key="`${item.prop}_${i}`" header-align="center" :prop="item.prop" :label="item.label" :title="item.title" :width="item.width" :renderHeader="renderHeader"></el-table-column>
    </el-table>
    <el-dialog title="问卷详情" :visible.sync="detailVisible">
      <div class="questionnaire-title">ID：{{questionnaireData.id}}</div>
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
import { formatDate } from '@admin/utils/date';
import { getResultsByQuestionnaireId } from '@admin/api';
import QnrRadioContent from '@admin/components/question/radio/Content.vue';
import QnrFillblankContent from '@admin/components/question/fillblank/Content.vue';
import QnrCheckboxContent from '@admin/components/question/checkbox/Content.vue';
import QnrPickerContent from '@admin/components/question/picker/Content.vue';
import QnrMatrixRadioContent from '@admin/components/question/matrix-radio/Content.vue';
import XLSX from 'xlsx';
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
    },
    xlsxHeader() {
      // columns格式
      // [
      //  {prop: "ip", label: "IP地址"},
      //  {prop: "start_time", label: "开始时间", width: 160},
      //  {prop: "end_time", label: "完成时间", width: 160},
      //  {prop: "answer_0", label: "1. 多选题", title: "多选题"},
      //  {prop: "answer_1", label: "2. 矩阵题", title: "矩阵题"}
      // ]
      return this.columns.map(v => v.label);
    },
    xlsxBody() {
      // results格式
      // [
      //   {answer_0, answer_1, answer_2, answer_3, answer_4, end_time, id, ip, questionnaire_id, start_time}
      // ]
      let body = this.results.map(line => {
        let tmp = {};
        for(let val of this.columns) {
          tmp[val.label] = line[val.prop] || '';
        }
        return tmp;
      });
      return body;
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
    },
    downloadExcel() {
      let header = this.xlsxHeader;
      let body = this.xlsxBody;
      let s2ab = (s) => {
        // 字符串转字符流
        let buf = new ArrayBuffer(s.length);
        let view = new Uint8Array(buf);
        for (let i = 0; i !== s.length; ++i) {
          view[i] = s.charCodeAt(i) & 0xFF;
        }
        return buf;
      };
      const workbook = {
        SheetNames: ['Sheet1'],
        Sheets: {},
        Props: {}
      };
      //通过json_to_sheet转成单页(Sheet)数据
      workbook.Sheets['Sheet1'] = XLSX.utils.json_to_sheet(body, { header });
      let blob = new Blob([
        s2ab(
          XLSX.write(workbook, {
            bookType: 'xlsx',
            bookSST: false,
            type: 'binary'
          })
        )
      ], {
        type: "application/octet-stream"
      });
      this.saveFile(blob);
    },
    saveFile(blob, filename) {
      let link = document.createElement('a');
      link.download = filename || `问卷${this.$route.params.id}_${formatDate(new Date())}_统计结果.xlsx`;
      link.href = URL.createObjectURL(blob); //绑定a标签
      document.body.appendChild(link);
      link.click(); //模拟点击实现下载
      setTimeout(() => {
        //延时释放
        URL.revokeObjectURL(blob); //用URL.revokeObjectURL()来释放这个object URL
        document.body.removeChild(link);
      }, 100);
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
