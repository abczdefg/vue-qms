<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-form>
      <el-form-item>
        <el-button type="primary" @click="createUser">添加用户</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="userData" border>
      <el-table-column header-align="center" type="index" width="40"></el-table-column>
      <el-table-column header-align="center" prop="username" label="用户名"></el-table-column>
      <el-table-column header-align="center" prop="role" label="用户组"></el-table-column>
      <el-table-column header-align="center" align="center" label="操作" width="75">
        <template slot-scope="scope">
          <el-button size="mini" type="danger"><i class="el-icon-delete"></i></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="创建用户" :visible.sync="editorVisible">
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
        <el-button type="primary" @click="submitForm">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getUsers, addUser, getRoles } from '../api';
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
    createUser() {
      this.editorVisible = true;
    },
    submitForm() {
      this.$refs['userForm'].validate(valid => {
        let { action, id } = this.$route.params;
        if (valid) {
          addUser(this.userForm).then(
            res => {
              this.editorVisible = false;
              this.$message.success(`添加用户成功`);
              this.getUserData();
            }
          ).catch(
            err => {this.$message.error(`添加用户失败：${err.message}`)}
          )
        } else {
          return false;
        }
      });
    }
  }
}
</script>
<style>
  .crumbs {
    margin-bottom: 24px;
  }
</style>
