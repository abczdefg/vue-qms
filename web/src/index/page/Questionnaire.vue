<template>
  <viewBox class="main-container" body-padding-top="46px" body-padding-bottom="0" ref="viewBox">
    <x-header class="header-container" :left-options="{showBack: false}" title="调查问卷"></x-header>
    <div class="page-container">
      <template v-if="indexPage">
        <div class="page-index page-content" v-if="questionnaireData">
          <p class="page-index-title">{{questionnaireData.title}}</p>
          <p class="page-index-introduction" v-html="questionnaireData.introduction"></p>
          <x-button class="page-button page-index-button" type="default" :plain="true" :mini="true" @click.native="startQnr">开始</x-button>
        </div>
      </template>
      <template v-else-if="!indexPage && currentPage < questionnaireData.page.length">
        <div class="page-content">
          <template v-for="(pageItem, pageIndex) in questionnaireData.page">
            <template v-if="currentPage === pageIndex">
              <div class="page-introduction">
                <p>{{partText}}</p>
              </div>
              <template v-for="(item, index) in pageItem">
                <compoent :is="`qnr-${item.type}`" :ref="`question_${pageIndex}`" :question="item" :index="index + 1" v-model="recordData[pageIndex][index].value"></compoent>
              </template>
              <x-button class="page-button" type="default" :plain="true" @click.native="nextPage">{{ (currentPage < questionnaireData.page.length - 1) ? '下一页' : '提交问卷' }}</x-button>
            </template>
          </template>
        </div>
      </template>
      <template v-else>
        <div class="page-end page-content">
          <div class="page-introduction">
            <p>感谢参与！</p>
          </div>
        </div>
      </template>
    </div>
  </viewBox>
</template>
<script>
import { XHeader, ViewBox, XButton } from 'vux'
import { QnrRadio, QnrCheckbox, QnrDatetime, QnrPicker, QnrAddress, QnrMatrixRadio, QnrFillblank } from '../components/question'
import { getQuestionnaire, submitQuestionnaire } from '../api'
export default {
  components: {
    XHeader,
    ViewBox,
    XButton,
    QnrRadio,
    QnrCheckbox,
    QnrDatetime,
    QnrPicker,
    QnrAddress,
    QnrMatrixRadio,
    QnrFillblank
  },
  mounted() {
    this.getQuestionnaire(this.$route.params.id);
  },
  computed: {
    partText() {
      const zh = ['零', '一', '二', '三', '四', '五', '六', '七'];
      return `第${zh[this.currentPage + 1]}部分`;
    }
  },
  watch: {
    indexPage(val, oldVal) {
      this.scrollToTop();
    },
    currentPage(val, oldVal) {
      this.scrollToTop();
    }
  },
  data() {
    return {
      time: {},
      indexPage: true,
      currentPage: 0,
      recordData: '',
      questionnaireData: null,
      submitData: null
    };
  },
  methods: {
    getQuestionnaire(id) {
      getQuestionnaire({id}).then(
        ({ data }) => {
          data.page = [data.question];
          this.questionnaireData = data;
          this.recordData = this.createModel();
        }
      ).catch(
        ({ message }) => this.$message.error(`获取问卷失败：${message}`)
      )
    },
    createModel() {
      return this.questionnaireData.page.map((pageItem, i) => {
        return pageItem.map((questionItem, j) => {
          let value = '';
          let { type } = questionItem;
          switch (type) {
            case 'radio':
            case 'datetime':
              value = '';
              break;
            case 'checkbox':
            case 'picker':
            case 'address':
              value = [];
              break;
            case 'matrix-radio':
              value = new Array(questionItem.subquestion.length).fill(null);
              break;
            case 'fillblank':
              value = new Array(questionItem.blank.length).fill(null);
              break;
            default:
              break;
          }
          return { type, value };
        })
      });
    },
    validatePage() {
      let valueMap = this.recordData[this.currentPage];
      let $questionList = [...this.$refs[`question_${this.currentPage}`]];
      for(let [i, val] of Object.entries(valueMap)) {
        let ret = $questionList[i].validate();
        if(ret !== true) {
          this.$vux.toast.text(ret);
          return false;
        }
      }
      return true;
    },
    startQnr() {
      this.indexPage = false;
      this.time.startTime = (new Date()).getTime();
    },
    nextPage() {
      if(this.validatePage()) {
        if(this.currentPage < this.questionnaireData.page.length - 1) {
          this.currentPage++;
        } else {
          (async () => {
            try {
              this.handleSubmitData();
              await submitQuestionnaire(this.submitData);
              this.$vux.toast.show({
                text: '问卷提交成功'
              });
              this.currentPage++;
            } catch(e) {
              console.dir(e)
              this.$vux.toast.show({
                text: '问卷提交失败',
                type: 'cancel'
              });
            }
          })();
        }
      }
    },
    handleSubmitData() {
      this.submitData = {
        start_time: this.time.startTime,
        end_time: (new Date()).getTime(),
        questionnaire_id: this.$route.params.id,
        answer: Array.prototype.concat.apply([], this.recordData).map(item => item.value)
      };
    },
    scrollToTop() {
      this.$refs.viewBox.scrollTo(0);
    }
  }
}

</script>
<style scoped>
.header-container {
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 100;
  -webkit-box-shadow: 0 1px 6px #ccc;
  box-shadow: 0 1px 6px #ccc;
}

.page-container {
  padding: 10px 0;
}

.page-container .page-content {
  padding: 0 10px;
}

.page-container .page-index {
  padding-top: 110px;
  padding-left: 20px;
  padding-right: 20px;
  text-align: center;
}

.page-container .page-index-title {
  line-height: 1.1;
  font-weight: bold;
  color: #000000;
  font-size: 30px;
  margin-bottom: 60px;
}

.page-container .page-index-introduction {
  margin-bottom: 60px;
  text-align: center;
  line-height: 24px;
}

.page-container .page-introduction {
  border: 1px dotted #efeff4;
  padding: 10px;
}

.page-container .page-introduction p {
  text-align: center;
  font-size: 17px;
  line-height: 28px;
  letter-spacing: 1px;
}
.page-container >>> .page-button {
  background-color: #ffffff;
  border-color: #cccccc;
  font-size: 16px;
}
.page-content.page-end {
  padding-left: 24px;
  padding-right: 24px;
}
.page-content .character-result-container p,
.page-container .character-introduction p {
  line-height: 20px;
  margin: 10px 0;
  font-size: 14px;
}
.page-container .character-result-container,
.page-container .radar-container {
  margin-bottom: 20px;
}
.page-container .character-result-container .character-result {
  color: red;
}
.page-container .radar-container >>> .echarts {
  width: auto;
  height: 215px;
}
.page-container .character-introduction p b {
  font-weight: bold;
}
</style>
