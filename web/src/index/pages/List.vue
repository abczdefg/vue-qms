<template>
  <viewBox class="main-container" body-padding-top="46px" body-padding-bottom="0" ref="viewBox">
    <x-header class="header-container" :left-options="{showBack: false}" title="调查问卷"></x-header>
    <div class="page-container">
      <load-more :tip="`正在加载`" v-if="!loaded"></load-more>
      <template v-else>
        <div class="page-content" v-if="questionnaires.length > 0">
          <div class="page-introduction">
            <p>请选择一个问卷</p>
          </div>
          <form-preview
            class="questionnaire-card"
            v-for="item in questionnaires"
            :key="item.id"
            :header-label="item.title"
            header-value=""
            :body-items="[{label:'介绍',value:item.introduction},{label:'创建时间',value:item.create_time}]"
            :footer-buttons="[{style:'default',text:'开始答题',link:`/detail/${item.id}`}]"
            :name="item.id">
          </form-preview>
        </div>
        <load-more :show-loading="false" :tip="'暂无数据'" background-color="#fbf9fe" v-else></load-more>
      </template>
    </div>
  </viewBox>
</template>
<script>
import { XHeader, ViewBox , FormPreview, LoadMore } from 'vux'
import { getQuestionnaires, getQuestionnaire } from '@index/api';
export default {
  components: {
    XHeader,
    ViewBox,
    FormPreview,
    LoadMore
  },
  mounted() {
    this.loaded = false;
    this.getQuestionnaires();
  },
  computed: {},
  data() {
    return {
      loaded: false,
      questionnaires: []
    };
  },
  methods: {
    getQuestionnaires() {
      getQuestionnaires().then(
        res => {
          this.loaded = true;
          this.questionnaires = res.data;
        }
      ).catch(err => err);
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

.page-container .questionnaire-card {
  margin-top: 20px;
  border-left: 1px solid #d9d9d9;
  border-right: 1px solid #d9d9d9;
}

.page-container .questionnaire-card >>> .weui-form-preview__label,
.page-container .questionnaire-card >>> .weui-form-preview__btn {
  color: #000000;
}
</style>
