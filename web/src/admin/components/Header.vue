<template>
  <el-header class="header">
    <div class="logo"><slot></slot></div>
    <div class="user-info">
      <el-dropdown trigger="click" @command="handleCommand">
        <div class="el-dropdown-link">
          {{username}}<i class="el-icon-arrow-down el-icon--right"></i>
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="updatePassword">修改密码</el-dropdown-item>
          <el-dropdown-item divided command="logout">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-dialog title="修改密码" :visible.sync="updatePasswordVisible">
      <el-form :model="passwordForm" ref="passwordForm" :rules="passwordRules" label-position="left" label-width="120px">
        <el-form-item label="旧密码" prop="oldPassword">
          <el-input v-model="passwordForm.oldPassword"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="newPassword">
          <el-input v-model="passwordForm.newPassword"></el-input>
        </el-form-item>
        <el-form-item label="再次输入密码" prop="checkPassword">
          <el-input v-model="passwordForm.checkPassword"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="hidePasswordEditor">取消</el-button>
        <el-button type="primary" @click="submitUpdatePassword">保存</el-button>
      </span>
    </el-dialog>
  </el-header>
</template>
<script>
  import { updateUserPassword, logout } from '@admin/api';
  export default {
    data() {
      let validatePassword = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.passwordForm.checkPasswork !== '') {
            this.$refs.passwordForm.validateField('checkPassword');
          }
          callback();
        }
      };
      let validateCheckPassword = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.passwordForm.newPassword) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        updatePasswordVisible: false,
        passwordForm: {
          oldPassword: '',
          newPassword: '',
          checkPassword: ''
        },
        passwordRules: {
          oldPassword: [
            { required: true, validator: validatePassword, trigger: 'blur' }
          ],
          newPassword: [
            { required: true, validator: validatePassword, trigger: 'blur' }
          ],
          checkPassword: [
            { required: true, validator: validateCheckPassword, trigger: 'blur' }
          ]
        }
      }
    },
    computed: {
      username() {
        let userData = this.$store.state.user.info;
        return userData && userData.username || '';
      }
    },
    methods: {
      handleCommand(command) {
        switch (command) {
          case 'updatePassword':
            this.showPasswordEditor();
            break;
          case 'logout':
            this.logout();
            break;
          default:
            break;
        }
      },
      showPasswordEditor() {
        this.$nextTick(() => {
          this.$refs['passwordForm'].resetFields();
        });
        this.updatePasswordVisible = true;
      },
      hidePasswordEditor() {
        this.$nextTick(() => {
          this.$refs['passwordForm'].resetFields();
        });
        this.updatePasswordVisible = false;
      },
      logout() {
        this.$store.dispatch('logout').then(
          res => {
            this.$message.success('退出成功');
            this.$router.replace('/login');
            // return this.$router.go(0); // 重置vue-router
          }
        ).catch(err => console.log(err));
      },
      submitUpdatePassword() {
        this.$refs['passwordForm'].validate().then(
          valid => {
            this.passwordForm.id = this.$store.state.user.info.id;
            updateUserPassword(this.passwordForm).then(
              res => {
                this.hidePasswordEditor();
                this.$message.success(`修改密码成功`);
              }
            ).catch(
              err => this.$message.error(`修改密码失败：${err.message}`)
            )
          }
        ).catch(
          err => console.log(err)
        )
      }
    }
  }
</script>
<style scoped>
  .header {
    background-color: #409EFF;
    color: #ffffff;
    vertical-align: middle;
  }
  .header .sidebar-toggle,
  .header .logo {
    display: inline-block;
    vertical-align: middle;
    line-height: 60px;
  }
  .header .sidebar-toggle {
    cursor: pointer;
  }
  .user-info {
    float: right;
    vertical-align: top;
  }
  .user-info .el-dropdown-link {
    padding-left: 50px;
    line-height: 60px;
    color: #ffffff;
    cursor: pointer;
    vertical-align: middle;
    display: inline-block;
    background: url("~@admin/assets/user.png") no-repeat;
    background-size: 40px 40px;
    background-position: 5px center;
  }
</style>
