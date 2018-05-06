<template>
  <div class="table">
    <el-form>
      <el-form-item>
        <el-button type="primary" @click="createUser">添加用户</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="userData" border>
      <el-table-column header-align="center" type="index" width="40"></el-table-column>
      <el-table-column header-align="center" prop="username" label="用户名"></el-table-column>
      <el-table-column header-align="center" prop="role" label="用户组"></el-table-column>
      <el-table-column header-align="center" prop="create_time" label="创建时间"></el-table-column>
      <el-table-column header-align="center" align="center" label="操作" width="80">
        <el-dropdown slot-scope="scope" trigger="click" placement="bottom" @command="handleUserCommand">
          <el-button size="mini" icon="el-icon-more-outline"></el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item :command="`delete:${scope.row.id}`">删除</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-table-column>
    </el-table>
    <el-dialog title="创建用户" :visible.sync="editorVisible" top="0">
      <el-form :model="userForm" ref="userForm" :rules="userRules" label-position="left" label-width="120px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="userForm.password"></el-input>
        </el-form-item>
        <el-form-item label="再次输入密码" prop="checkPassword">
          <el-input v-model="userForm.checkPassword"></el-input>
        </el-form-item>
        <el-form-item label="角色组" prop="role">
          <el-select v-model="userForm.role" placeholder="请选择">
            <el-option v-for="item in roleData" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editorVisible=false">取消</el-button>
        <el-button type="primary" @click="submitAddUser">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getUsers, addUser, getRoles, deleteUser } from '@admin/api';
export default {
  data() {
    let validatePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.userForm.checkPasswork !== '') {
          this.$refs.userForm.validateField('checkPassword');
        }
        callback();
      }
    };
    let validateCheckPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.userForm.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      userData: [],
      roleData: [],
      userForm: {
        username: '',
        password: '',
        checkPassword: ''
      },
      userRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, validator: validatePassword, trigger: 'blur' }
        ],
        checkPassword: [
          { required: true, validator: validateCheckPassword, trigger: 'blur' }
        ],
        role: [
          { required: true, message: '请选择用户组', trigger: 'blur' }
        ]
      },
      editorVisible: false
    }
  },
  mounted() {
    this.getUserData();
    this.getRoleData();
  },
  methods: {
    getUserData() {
      getUsers().then(
        res => this.userData = res.data
      ).catch(
        err => this.$message.error(`获取用户列表失败：${err.message}`)
      )
    },
    getRoleData() {
      getRoles().then(
        res => this.roleData = res.data
      ).catch(
        err => this.$message.error(`获取用户组列表失败：${err.message}`)
      )
    },
    deleteUser(id) {
      this.$confirm('确认删除用户？').then(
        res => {
          deleteUser({ id }).then(
            res => {
              this.$message.success('删除成功');
              this.getUserData();
            }
          ).catch(
            err => this.$message.error(`删除用户失败：${err.message}`)
          )
      }).catch(
        cancel => ''
      );
    },
    createUser() {
      this.editorVisible = true;
    },
    submitAddUser() {
      this.$refs['userForm'].validate().then(
        valid => {
          this.questionnaireForm.create_time = new Date();
          addUser(this.userForm).then(
            res => {
              this.editorVisible = false;
              this.$message.success(`添加用户成功`);
              this.getUserData();
            }
          ).catch(
            err => this.$message.error(`添加用户失败：${err.message}`)
          )
        }
      ).catch(err => err);
    },
    handleUserCommand(arg) {
      let [command, id] = arg.split(':');
      switch (command) {
        case 'delete':
          this.deleteUser(id);
          break;
        default:
          break;
      }
    }
  }
}
</script>
<style scoped>
</style>
