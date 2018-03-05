<template>
  <viewBox class="main-container" body-padding-top="46px" body-padding-bottom="0" ref="viewBox">
    <x-header class="header-container" :left-options="{showBack: false}" title="调查问卷"></x-header>
    <div class="page-container">
      <template v-if="indexPage">
        <div class="page-index page-content">
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
                <p>第{{chineseNumber}}部分</p>
              </div>
              <template v-for="(item, index) in pageItem">
                <qnr-question :ref="`question-${pageIndex}`" :key="item.title" :question="item" :index="index + 1" v-model="recordData[pageIndex][index].value"></qnr-question>
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
import { QnrRadio, QnrCheckbox, QnrDatetime, QnrPicker, QnrAddress, QnrMatrixRadio } from '../components/question'
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
    QnrQuestion: {
      render(h) {
        let self = this;
        let component;
        switch(self.question.type) {
          case 'radio':
           component = QnrRadio;
          break;
          case 'checkbox':
           component = QnrCheckbox;
          break;
          case 'datetime':
           component = QnrDatetime;
          break;
          case 'picker':
           component = QnrPicker;
          break;
          case 'address':
           component = QnrAddress;
          break;
          case 'matrix-radio':
           component = QnrMatrixRadio;
          break;
        }
        return h(component, {
          props: {
            question: self.question,
            index: self.index,
            value: self.value // value是自定义组件属性
          },
          on: {
            input: function (newVal) {
              self.$emit('input', newVal);
            }
          }
        });
      },
      props: ['index','value','question']
    }
  },
  mounted() {
    this.getQuestionnaire(this.$route.params.id);
  },
  computed: {
    chineseNumber() {
      return ['零', '一', '二', '三', '四', '五', '六', '七'][this.currentPage + 1];
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
      questionnaireData: {},
      submitData: null
    };
  },
  methods: {
    getQuestionnaire(id) {
      getQuestionnaire({id}).then(
        res => {
          let { data } = res;
          data.page = [data.question];
          this.questionnaireData = data;
          this.recordData = this.createModel();
        }
      ).catch(
        err => this.$message.error(`获取问卷失败：${err.message}`)
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
            default:
              break;
          }
          return { type, value };
        })
      });
    },
    validatePage() {
      let validateQuestion = ({type, value}) => {
        switch(type) {
          case 'radio':
          case 'datetime':
            return value !== '';
          case 'checkbox':
          case 'picker':
          case 'address':
            return value.length > 0;
          case 'matrix-radio':
            return value.indexOf(null) === -1;
        }
        return false;
      };
      let createErrorMsg = ({ number }) => {
        // switch(type) {
        //   case 'radio':
        //   case 'datetime':
        //   case 'checkbox':
        //   case 'picker':
        //   case 'address':
        //     return `题目${number}未完成`;
        //   case 'matrix-radio':
        //     return `题目${number}-${data.index}未完成`;
        // }
        return `题目${number}未完成`;
      };
      let valueMap = this.recordData[this.currentPage];
      for(let [i, val] of Object.entries(valueMap)) {
        if(validateQuestion(val) !== true) {
          this.$vux.toast.text(createErrorMsg({
            type: val.type,
            number: parseInt(i, 10) + 1
          }));
          return false;
        }
      }
      return true;
    },
    startQnr() {
      this.indexPage = false;
    },
    nextPage() {
      if(this.validatePage()) {
        if(this.currentPage < this.questionnaireData.page.length - 1) {
          this.currentPage++;
        } else {
          (async () => {
            try {
              this.handleSubmitData();
              let ret = await submitQuestionnaire(this.submitData);
              this.$vux.toast.show({
                text: '问卷提交成功'
              });
              this.currentPage++;
            } catch(e) {
              console.log(e)
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
