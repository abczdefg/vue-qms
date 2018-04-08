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
          <div class="page-introduction">
            <p>{{pageText}}</p>
          </div>
          <qnr-page ref="questionPage" :page-data="questionnaireData.page[currentPage]" v-model="recordData[currentPage]"></qnr-page>
          <x-button class="page-button" type="default" :plain="true" @click.native="nextPage">{{ (currentPage < questionnaireData.page.length - 1) ? '下一页' : '提交问卷' }}</x-button>
        </div>
      </template>
      <template v-else>
        <div class="page-end page-content">
          <img class="end-logo" src="~@index/assets/img/end.png"/>
          <p class="end-text">问卷到此结束，感谢您的参与！</p>
        </div>
      </template>
    </div>
  </viewBox>
</template>
<script>
import { XHeader, ViewBox, XButton } from 'vux'
import { Picker } from 'vux'
// import { QnrRadio, QnrCheckbox, QnrDatetime, QnrPicker, QnrAddress, QnrMatrixRadio, QnrFillblank } from '@index/components/question'
import QnrPage from '@index/components/question/QuestionPage.vue'
import { getQuestionnaireById, addResult } from '@index/api'
export default {
  components: {
    XHeader,
    ViewBox,
    XButton,
    QnrPage,
    Picker
  },
  mounted() {
    this.getQuestionnaireById(this.$route.params.id);
  },
  computed: {
    pageText() {
      const num = this.currentPage + 1;
      return `第${num}部分`;
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
      submitData: null,
    };
  },
  methods: {
    getQuestionnaireById(id) {
      getQuestionnaireById({id}).then(
        ({ data }) => {
          data.page = [data.question];
          this.questionnaireData = data;

          /////////////////
          // this.questionnaireData.page = [
          //   [{
          //     "title": "第一页 ",
          //     "type": "radio",
          //     "choice": [{
          //       "content": "非常不幸福"
          //     }]
          //   }, {
          //     "title": "第一页2",
          //     "type": "radio",
          //     "choice": [{
          //       "content": "非常不幸福"
          //     }]
          //   }], [{
          //     "title": "第二页 ",
          //     "type": "radio",
          //     "choice": [{
          //       "content": "非常不幸福"
          //     }]
          //   }
          //   ]
          // ]
          /////////////////
          this.recordData = this.createModel();
        }
      ).catch(
        ({ code, message }) => {
          if(code === 500) {
            return this.$router.replace({name: 'List'});
          }
          this.$vux.toast.text(`获取问卷失败：${message}`, 'bottom');
        }
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
          return value;
        })
      });
    },
    validatePage() {
      return this.$refs.questionPage.validate();
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
              console.log(this.submitData)
              // await addResult(this.submitData);
              // this.$vux.toast.show({
              //   text: '问卷提交成功'
              // });
              // this.currentPage++;
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
    },
    convertRoman(num) {

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
  margin-bottom: 10px;
}

.page-container .page-introduction p {
  text-align: center;
  font-size: 17px;
  line-height: 28px;
  letter-spacing: 1px;
}
.page-container .page-button {
  background-color: #ffffff;
  border-color: #cccccc;
  font-size: 16px;
}
.page-content.page-end {
  padding-left: 24px;
  padding-right: 24px;
  text-align: center;
}
.page-end .end-logo {
  margin: 100px 0;
}
</style>
