<template>
  <div class="main-container">
    <p>欢迎使用问卷管理系统</p>
    <el-row class="panel-group" :gutter="40">
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
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
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
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
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
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
        usersCount: 0
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
      },
    }
  }

</script>
<style scoped>
.panel-group {
  margin-top: 18px;
}
.card-panel-col {
  margin-bottom: 32px;
}
.card-panel {
  height: 108px;
  cursor: pointer;
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
}
.card-panel-icon-wrapper {
  transition: all 0.38s ease-out;
}
.card-panel-icon {
  font-size: 48px;
}
.card-panel-description {
  font-weight: bold;
}
.card-panel-text {
  line-height: 18px;
  color: rgba(0, 0, 0, 0.45);
  font-size: 16px;
  margin-bottom: 12px;
}
.card-panel-num {
  font-size: 20px;
}
</style>
