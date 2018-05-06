<template>
  <div class="result-container">
    <el-form>
      <el-form-item>
        <el-button type="primary" icon="el-icon-tickets" @click="detailVisible = true">问卷详情</el-button>
        <el-button type="primary" @click="queryIpVisible = true">查询IP归属地</el-button>
        <el-button type="success" icon="el-icon-download" @click="downloadExcel">导出excel</el-button>
      </el-form-item>
    </el-form>
    <el-table class="result-table" :data="pageData" border style="width:100%">
      <el-table-column header-align="center" type="index" width="40"></el-table-column>
      <el-table-column v-for="(item, i) in columns" :key="`${item.prop}_${i}`" header-align="center" :prop="item.prop" :label="item.label" :title="item.title" :width="item.width" :renderHeader="renderHeader"></el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handlePageChange" :current-page="pageinationData.page" :page-sizes="pageinationData.sizeList" :page-size="pageinationData.limit" layout="total, sizes, prev, pager, next, jumper" :total="results.length">
      </el-pagination>
    </div>
    <el-dialog class="detail-dialog" title="问卷详情" :visible.sync="detailVisible" top="0">
      <div class="questionnaire-title">ID：{{questionnaireData.id}}</div>
      <div class="questionnaire-title">标题：{{questionnaireData.title}}</div>
      <div class="questionnaire-introduction">介绍：{{questionnaireData.introduction}}</div>
      <div class="questionnaire-update-time">最后更新时间：{{questionnaireData.update_time}}</div>
      <div class="questionnaire-question-container">
        <ul>
          <li class="question-list" v-for="(item, i) in addQuestionIndex(questionnaireData).question">
            <component :is="`qnr-${item.type}-content`" :data="item"></component>
          </li>
        </ul>
      </div>
    </el-dialog>
    <el-dialog title="IP查询" :visible.sync="queryIpVisible" top="0">
      <el-form :model="queryIpForm" ref="queryIpForm" :rules="queryIpRules" label-position="left" label-width="120px">
        <el-form-item label="IP地址" prop="ip">
          <el-input v-model="queryIpForm.ip"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="queryIp">查询</el-button>
      </div>
    </el-dialog>
  </div>
</div>

</template>

<script>
import { formatDate } from '@admin/utils/date';
import { addQuestionIndex } from '@/utils';
import { getQuestionnaire, getResultsByQuestionnaireId } from '@admin/api';
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
      detailVisible: false,
      queryIpVisible: false,
      queryIpForm: {
        ip: ''
      },
      queryIpRules: {
        ip: [
          { required: true, message: '请填写IP地址', trigger: 'blur' },
          { pattern: /^(25[0-5]|2[0-4]\d|[0-1]?\d?\d)(\.(25[0-5]|2[0-4]\d|[0-1]?\d?\d)){3}$/, message: 'IP地址格式有误', trigger: 'blur' }
        ]
      },
      pageinationData: {
        page: 1,
        limit: 10,
        sizeList: [10, 20, 30, 50]
      },
    }
  },
  created() {
    let questionnaireId = this.$route.params.id;
    this.getQuestionnaire(questionnaireId);
    this.getResultsByQuestionnaireId(questionnaireId);
    // this.$store.dispatch('hideSidebar');
  },
  beforeDestroy() {
    this.$store.dispatch('showSidebar');
  },
  computed: {
    pageData() {
      const page = this.pageinationData.page;
      const limit = this.pageinationData.limit;
      return this.results.slice((page - 1) * limit, page * limit);
    },
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
    getQuestionnaire(id) {
      getQuestionnaire({id}).then(
        res => this.questionnaireData = res.data
      ).catch(
        err => this.$message.error(`获取问卷失败：${err.message}`)
      )
    },
    getResultsByQuestionnaireId(id) {
      getResultsByQuestionnaireId({id}).then(
        res => this.resultData = res.data
      ).catch(
        err => this.$message.error(`获取问卷结果失败：${err.message}`)
      )
    },
    addQuestionIndex: addQuestionIndex,
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
    },
    queryIp() {
      const ip = this.queryIpForm.ip;
      const getResultByJsonp = () => {
        const link = `http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=js&ip=${ip}`
        const script = document.createElement('script');
        script.src = link;
        document.body.appendChild(script);
        script.onload = () => {
          document.body.removeChild(script);
          if(remote_ip_info) {
            this.$alert(`${ip}的归属地：${remote_ip_info.country} ${remote_ip_info.province} ${remote_ip_info.city} ${remote_ip_info.district}`);
          }
        }
      }
      this.$refs['queryIpForm'].validate().then(valid => getResultByJsonp()).catch(err => err);
    },
    handleSizeChange(val) {
      this.pageinationData.limit = val
    },
    handlePageChange(val) {
      this.pageinationData.page = val
    },
  }
}
</script>
<style scoped>
.question-list {
  margin: 20px 0;
  display: flex;
  flex-direction: row;
}
.result-table {
  margin-bottom: 22px;
}
</style>
