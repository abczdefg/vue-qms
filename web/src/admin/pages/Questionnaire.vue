<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>问卷管理</el-breadcrumb-item>
        <el-breadcrumb-item>问卷列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-form>
      <el-form-item>
        <el-button type="primary" @click="createQuestionnaire">添加问卷</el-button>
      </el-form-item>
    </el-form>
    <!-- <el-form :inline="true" :model="formInline">
      <el-form-item>
        <el-select v-model="formInline.region" placeholder="活动区域">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="formInline.searchText" placeholder="审批人"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="search">搜索</el-button>
      </el-form-item>
    </el-form> -->
    <el-table :data="questionnaireData" border style="width:100%">
      <el-table-column header-align="center" type="index" width="40"></el-table-column>
      <el-table-column header-align="center" prop="title" label="标题"></el-table-column>
      <el-table-column header-align="center" prop="introduction" label="介绍"></el-table-column>
      <el-table-column header-align="center" prop="random" label="随机" width="60" :formatter="formatRandom"></el-table-column>
      <el-table-column header-align="center" prop="create_time" label="创建时间"></el-table-column>
      <el-table-column header-align="center" prop="update_time" label="修改时间"></el-table-column>
      <el-table-column header-align="center" align="center" label="操作" width="150">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="editQuestionnaire(scope.$index, scope.row)"><i class="el-icon-edit"></i></el-button>
          <el-button size="mini" type="danger" @click="deleteQuestionnaire(scope.$index, scope.row)"><i class="el-icon-delete"></i></el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</div>

</template>

<script>
import { getQuestionnaires, deleteQuestionnaire } from '@admin/api';
export default {
  data() {
    return {
      formInline: {
        user: '',
        region: ''
      },
      questionnaireData: []
    }
  },
  mounted() {
    this.getUserData();
  },
  methods: {
    getUserData() {
      getQuestionnaires().then(
        res => {
          this.questionnaireData = res.data;
        }
      ).catch(
        err => this.$message.error(`获取问卷列表失败：${err.message}`)
      )
    },
    createQuestionnaire() {
      this.$router.push({path: `/questionnaire/add`});
    },
    editQuestionnaire(index, row) {
      this.$router.push({path: `/questionnaire/edit/${row.id}`});
    },
    deleteQuestionnaire(index, row) {
      this.$confirm('确认删除问卷？').then(
        res => {
          deleteQuestionnaire({ id: row.id }).then(
            res => {
              this.$message.success('删除成功');
              this.getUserData();
            }
          ).catch(
            err => this.$message.error(`删除问卷失败：${err.message}`)
          )
      }).catch(
        cancel => ''
      );
    },
    formatRandom(row, column, cellValue) {
      return cellValue ? '是' : '否';
    }
  }
}
</script>
<style>
  .crumbs {
    margin-bottom: 24px;
  }
</style>
