<template>
  <el-form :model="loginForm" :rules="loginRule" ref="loginForm" label-position="left" label-width="0px" class="demo-ruleForm login-container">
    <h3 class="title">问卷管理系统</h3>
    <el-form-item prop="account">
      <el-input type="text" v-model="loginForm.account" auto-complete="off" placeholder="账号"></el-input>
    </el-form-item>
    <el-form-item prop="checkPass">
      <el-input type="password" v-model="loginForm.checkPass" auto-complete="off" placeholder="密码"></el-input>
    </el-form-item>
    <el-form-item>
      <el-checkbox v-model="checked" label="记住密码"></el-checkbox>
    </el-form-item>
    <el-form-item style="width:100%;">
      <el-button class="login-button" type="primary" @click.native.prevent="login" :loading="logining">登录</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import { startLogin } from '../api';
  export default {
    data() {
      return {
        logining: false,
        loginForm: {
          account: 'admin',
          checkPass: 'admin'
        },
        loginRule: {
          account: [
            { required: true, message: '请输入账号', trigger: 'blur' },
          ],
          checkPass: [
            { required: true, message: '请输入密码', trigger: 'blur' },
          ]
        },
        checked: true
      };
    },
    methods: {
      login() {
        this.$refs.loginForm.validate(valid => {
          if (!valid) {
            return false;
          } else {
            this.logining = true;
            startLogin({
              username: this.loginForm.account,
              password: this.loginForm.checkPass
            }).then(res => {
              this.logining = false;
              let { message, code, data } = res;
              this.$store.dispatch('login', data).then(res => this.$router.replace({ path: '/' }));
            }).catch(res => {
              this.logining = false;
              this.$message.error(`登录失败：${res.message}`);
            });
          }
        });
      }
    }
  }

</script>

<style scoped>
  .login-container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 350px;
    padding: 35px 35px 15px 35px;
    border: 1px solid #eaeaea;
    border-radius: 5px;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    box-shadow: 0 0 25px #cac6c6;
    background: #fff;
    background-clip: padding-box;
  }
  .title {
    margin: 0px auto 40px auto;
    text-align: center;
  }
  .login-button {
    width: 100%;
  }
</style>
