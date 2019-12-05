<template>
<div class="site-wrapper site-page--login">
  <div class="site-content__wrapper">
    <div class="site-content">
      <div class="brand-info">
        <div class="content has-text-centered">
          <div>
            <h1 id="java-springboot-elementui-activiti-">Java Springboot elementui activiti前后端分离，流程审批，权限管理框架源码</h1>

            <hr>
            <h2 id="-java-" style="">中建一局融资管控项目。</h2>
            <hr>


            <hr>
          </div>
        </div>
      </div>
      <div class="login-main">
        <h3 class="login-title">系统登录(admin/123qwe.asd)</h3>
        <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" status-icon>
          <el-form-item prop="userName">
            <el-input v-model="dataForm.userName" placeholder="帐号"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="dataForm.password" type="password" placeholder="密码"></el-input>
          </el-form-item>
          <el-form-item prop="rememberme" label="记住密码">
            <el-switch v-model="dataForm.rememberme">记住密码</el-switch>
          </el-form-item>
          <el-form-item prop="captcha" v-if="showCaptch">
            <el-row :gutter="20">
              <el-col :span="14">
                <el-input v-model="dataForm.captcha" placeholder="验证码">
                </el-input>
              </el-col>
              <el-col :span="10" class="login-captcha">
                <img :src="captchaPath" @click="showCaptcha()" alt="" style="height:34px">
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item>
            <el-button class="login-btn-submit" type="primary" @click="dataFormSubmit()" :loading="isLoading" autofocus>登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import {
  mapState,
  mapActions,
  mapMutations
} from 'vuex'
import Qs from 'qs'
import axios from 'axios'
export default {
  name: 'login',
  data () {
    return {
      appName: window.SITE_CONFIG['appName'],
      captchaPath: '',
      showCaptch: false,
      dataForm: {
        userName: 'admin',
        password: '123qwe.asd',
        rememberme: true,
        captcha: ''
      },
      dataRule: {
        userName: [{
          required: true,
          message: '请输入账号',
          trigger: 'blur'
        } ],
        password: [{
          required: true,
          message: '请输入密码',
          trigger: 'blur'
        }],
        captcha: [{
          required: true,
          message: '请输入验证码',
          trigger: 'blur'
        }]
      }
    }
  },
  created () {
    this.$store.commit('loginOut')
    this.initDefaultUserName()
  },
  methods: {
    initDefaultUserName () {
      let loginId = this.$util.getCookie('userLoginId')
      if (loginId) {
        this.dataForm.userName = loginId
      }
    },
    setDefaultUserName (loginId) {
      this.$util.setCookie('userLoginId', loginId)
    },
    dataFormSubmit () {
      let self = this
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          self.$store.commit('startLoading')

          let data = Qs.stringify({
            username: self.dataForm.userName,
            password: self.dataForm.password,
            authType: 'adm-u',
            validateCode: self.dataForm.captcha,
            rememberme: self.dataForm.rememberme
          })
          let url = '/pmtapi/base_Account/login?' + data
          self.$http.post(url, {'Content-Type': 'application/x-www-form-urlencoded'})
            .then(function (response) {
              self.$store.commit('loginIn', {
                userId: response.id,
                userLoginId: response.loginId,
                userDisplayName: response.name,
                userMobile: response.mobile,
                userGrouplist: response.grouplist,
                userDepartmentlist: response.departmentlist
              })
              self.$store.commit('endLoading')

              self.setDefaultUserName(self.dataForm.userName)

              let toPath = null

              let userShouldChangePassword = response.shouldChangePassword
              if (userShouldChangePassword) {
                toPath = '/firstLoginChangePassword'
              } else {
                if (self.$router.currentRoute && self.$router.currentRoute.query) {
                  toPath = self.$router.currentRoute.query.to
                }
                if (!toPath) {
                  toPath = '/'
                }
              }
              self.$router.push({
                path: toPath
              })
              self.$message({
                message: '登陆成功',
                type: 'success',
                onClose: function () {}
              })
            })
            .catch(function (error) {
              debugger
              if (error.payload && error.payload == 1) {
                self.showCaptcha()
              }
              self.$store.commit('endLoading')
              // self.$message.error(error);
            })
        } else {
          self.$message.error('系统输入验证失败！')
          return false
        }
      })
    },
    showCaptcha () {
      this.captchaPath = window.SITE_CONFIG.serverUrl + '/kaptcha/get?' + Math.floor(Math.random() * 100)
      this.showCaptch = true
    }
  },
  computed: {
    ...mapState({
      isLoading: state => state.ui.isLoading
    })
  }
}
</script>

<style lang="scss">
.site-wrapper.site-page--login {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(38, 50, 56, .6);
    overflow: hidden;
    &:before {
        position: fixed;
        top: 0;
        left: 0;
        z-index: -1;
        width: 100%;
        height: 100%;
        content: "";
        background-image: url("~@/assets/img/login_bg.jpg");
        background-size: cover;
    }
    .site-content__wrapper {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        padding: 0;
        margin: 0;
        overflow-x: hidden;
        overflow-y: auto;
        background-color: transparent;
    }
    .site-content {
        min-height: 100%;
        padding: 30px 500px 30px 30px;
    }
    .brand-info {
        margin: 0 100px 0 90px;
        color: #fff;
    }
    .brand-info__text {
        margin: 0;
        font-size: 48px;
        font-weight: 400;
        text-transform: uppercase;
    }
    .brand-info__intro {
        margin: 10px 0;
        font-size: 16px;
        line-height: 1.58;
        opacity: 0.6;
    }
    .login-main {
        position: absolute;
        top: 0;
        right: 0;
        padding: 150px 60px 180px;
        width: 470px;
        min-height: 100%;
        background-color: #fff;
    }
    .login-title {
        font-size: 16px;
    }
    .login-captcha {
        overflow: hidden;
        > img {
            width: 100%;
            cursor: pointer;
        }
    }
    .login-btn-submit {
        width: 100%;
        margin-top: 38px;
    }
}
</style>
