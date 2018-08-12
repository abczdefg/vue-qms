<template>
  <div class="table">
    <el-form>
      <el-form-item>
        <el-button type="primary" @click="createQuestionnaire">添加问卷</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="questionnaireData" border style="width:100%">
      <el-table-column header-align="center" type="index" width="40"></el-table-column>
      <el-table-column header-align="center" prop="title" label="标题"></el-table-column>
      <el-table-column header-align="center" prop="introduction" label="介绍"></el-table-column>
      <!-- <el-table-column header-align="center" prop="random" label="随机" width="60" :formatter="formatRandom"></el-table-column> -->
      <el-table-column header-align="center" prop="create_time" label="创建时间"></el-table-column>
      <el-table-column header-align="center" prop="update_time" label="修改时间"></el-table-column>
      <el-table-column header-align="center" prop="publish" label="发布状态" width="80" :formatter="formatPublish">
        <template slot-scope="scope">
          <el-tag size="small" :type="scope.row.publish ? `success` : `danger`">{{ formatPublish(scope.row.publish) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="操作" width="80">
        <el-dropdown slot-scope="scope" trigger="click" placement="bottom" @command="handleQuestionnaireCommand">
          <el-button size="mini" icon="el-icon-more-outline"></el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-if="scope.row.publish" :command="`unpublish:${scope.row.id}`">取消发布</el-dropdown-item>
            <el-dropdown-item v-else :command="`publish:${scope.row.id}`">发布</el-dropdown-item>
            <el-dropdown-item :command="`edit:${scope.row.id}`">修改</el-dropdown-item>
            <el-dropdown-item :command="`result:${scope.row.id}`">统计</el-dropdown-item>
            <el-dropdown-item :command="`delete:${scope.row.id}`">删除</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination background @size-change="pageinationData.limit = val" @current-change="pageinationData.page = val" :current-page="pageinationData.page" :page-sizes="pageinationData.sizeList" :page-size="pageinationData.limit" layout="total, sizes, prev, pager, next, jumper" :total="questionnaireData.length">
      </el-pagination>
    </div>
  </div>
</div>

</template>

<script>
import { getQuestionnaires, deleteQuestionnaire, publishQuestionnaire } from '@admin/api';
export default {
  data() {
    return {
      formInline: {
        user: '',
        region: ''
      },
      questionnaireData: [],
      pageinationData: {
        page: 1,
        limit: 10,
        sizeList: [10, 20, 30, 50]
      },
    }
  },
  mounted() {
    this.getQuestionnaires ();
  },
  computed: {
    pageData() {
      const page = this.pageinationData.page;
      const limit = this.pageinationData.limit;
      return this.questionnaireData.slice((page - 1) * limit, page * limit);
    },
  },
  methods: {
    getQuestionnaires () {
      getQuestionnaires().then(
        res => {
          this.questionnaireData = res.data;
        }
      ).catch(
        err => this.$message.error(`获取问卷列表失败：${err.message}`)
      )
    },
    createQuestionnaire() {
      this.$router.push({path: `/questionnaire/detail/add`});
    },
    editQuestionnaire(id) {
      this.$router.push({path: `/questionnaire/${id}/detail/edit`});
    },
    publishQuestionnaire({id, publish}) {
      let msg = publish ? '' : '取消';
      publishQuestionnaire({id, publish}).then(
        res => {
          this.$message.success(`${msg}发布问卷成功`);
          this.getQuestionnaires();
        }
      ).catch(
        err => this.$message.error(`${msg}发布问卷失败：${err.message}`)
      );
    },
    deleteQuestionnaire(id) {
      this.$confirm('确认删除问卷？').then(
        res => {
          deleteQuestionnaire({ id }).then(
            res => {
              this.$message.success('删除成功');
              this.getQuestionnaires();
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
    },
    formatPublish(cellValue) {
      return cellValue ? '已发布' : '未发布';
    },
    handleQuestionnaireCommand(arg) {
      let [command, id] = arg.split(':');
      switch (command) {
        case 'edit':
          this.editQuestionnaire(id);
          break;
        case 'delete':
          this.deleteQuestionnaire(id);
          break;
        case 'publish':
        case 'unpublish':
          this.publishQuestionnaire({
            id,
            publish: command === 'publish'
          });
          break;
        case 'result':
          this.$router.push({path: `/questionnaire/${id}/result`});
          break;
        default:
          break;
      }
    },
  }
}
</script>
<style scoped>
  .table-more-button {

  }
</style>
