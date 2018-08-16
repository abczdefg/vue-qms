<template>
  <div class="home">
    <el-carousel class="index-slider" height="300px">
      <el-carousel-item v-for="(item, i) in sliders" :key="i">
        <h3>{{ item.text }}</h3>
      </el-carousel-item>
    </el-carousel>
    <!-- <h3>欢迎使用问卷管理系统</h3> -->
    <el-row class="panel-group" :gutter="40">
      <el-col :xs="12" :sm="6" :lg="6" class="card-panel-col">
        <div class='card-panel'>
          <div class="card-panel-icon-wrapper">
            <i class="card-panel-icon fa fa-file-o"></i>
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">问卷数目</div>
            <count-to class="card-panel-num" :startVal="0" :endVal="questionnairesCount" :duration="2000"></count-to>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="6" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper">
            <i class="card-panel-icon fa fa-file-text-o"></i>
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">答卷数目</div>
            <count-to class="card-panel-num" :startVal="0" :endVal="resultsCount" :duration="2000"></count-to>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="6" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper">
            <i class="card-panel-icon fa fa-user-o"></i>
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">用户数目</div>
            <count-to class="card-panel-num" :startVal="0" :endVal="usersCount" :duration="2000"></count-to>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import CountTo from 'vue-count-to';
  import { getQuestionnairesCount, getResultsCount, getUsersCount } from '@admin/api';
  export default {
    components: {
      CountTo
    },
    created() {
      this.getQuestionnairesCount();
      this.getResultsCount();
      this.getUsersCount();
    },
    data() {
      return {
        questionnairesCount: 0,
        resultsCount: 0,
        usersCount: 0,
        sliders: [{
          text: '欢迎使用问卷管理系统'
        }, {
          text: '自定义多种类型题目'
        }, {
          text: '导出Excel处理数据'
        }]
      }
    },
    methods: {
      getQuestionnairesCount() {
        getQuestionnairesCount().then(
          res => {
            this.questionnairesCount = res.data.total;
          }
        ).catch(err => err);
      },
      getResultsCount() {
        getResultsCount().then(
          res => {
            this.resultsCount = res.data.total;
          }
        ).catch(err => err);
      },
      getUsersCount() {
        getUsersCount().then(
          res => {
            this.usersCount = res.data.total;
          }
        ).catch(err => err);
      }
    }
  }

</script>
<style lang="less" scoped>
.home {
  .index-slider {
    background: url('~@admin/assets/index_sliders_bg.jpg') no-repeat center center;
    background-size: cover;
    h3 {
      color: #ffffff;
      font-size: 24px;
      line-height: 300px;
      text-align: center;
    }
  }
  .panel-group {
    margin-top: 18px;
  }
  .card-panel-col {
    margin-bottom: 32px;
  }
  .card-panel {
    height: 90px;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666666;
    background: #ffffff;
    border: 1px solid #cccccc;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    &-icon-wrapper {
      transition: all 0.38s ease-out;
    }
    &-icon {
      font-size: 48px;
    }
    &-description {
      font-weight: bold;
    }
    &-text {
      line-height: 18px;
      color: rgba(0, 0, 0, 0.45);
      font-size: 16px;
      margin-bottom: 12px;
    }
    &-num {
      font-size: 20px;
    }
  }
}
</style>
