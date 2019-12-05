

<template>
<el-dialog title="修改密码" :visible.sync="visible" :append-to-body="true">
  <el-form :model="model" ref="ruleForm" @keyup.enter.native="dataFormSubmit()" label-width="120px">
    <el-form-item label="姓名">
      <span>{{ model.name }}</span>
    </el-form-item>
    <el-form-item label="账号">
      <span>{{ model.loginId }}</span>
    </el-form-item>
    <el-form-item label="新密码" prop="newPassword" verify :maxLength="128" class="is-required" >
      <el-input v-model="model.newPassword" type="password"></el-input>
    </el-form-item>
    <el-form-item label="确认新密码" prop="confirmNewPassword" verify  :maxLength="128" class="is-required" >
      <el-input v-model="model.confirmNewPassword" type="password"></el-input>
    </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">

  <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
      <el-button @click="visible = false">取消</el-button>
    </span>
</el-dialog>
</template>

<script>
export default {
  data() {

    return {
      visible: false,
      model: {},
    }
  },
  created() {

  },
  activated() {

  },
  methods: {
    // 初始化
    init(id) {
      this.visible = true
      let self = this;
      if (id) {
        tapp.services.base_User.getUser(id).then(function(result) {
          self.$refs.ruleForm.resetFields();
          self.model = result;
        });
      }
    },
    dataFormSubmit() {

      let self = this;
      self.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          if (!(/^(?![0-9]+$)(?![a-zA-Z]+$)(?!(.)\1{5}).{6,16}$/.test(self.model.newPassword))) {
            self.$notify.error({
              title: '系统输入验证失败',
              message: '新密码强度弱，长度必须在6位和16位数之间，包含字母数字！'
            });
            return;
          }
          if (self.model.newPassword !== self.model.confirmNewPassword) {
            self.$notify.error({
              title: '系统输入验证失败',
              message: '确认新密码与新密码不一致！'
            });
            return;
          }

          tapp.services.base_User.adminChangePassword(self.model).then(function(result) {
            self.$notify.success({
              title: '操作成功！',
              message: '修改密码成功！',
              onClose: function() { 
              }
            });
          });
        } else {
          this.$notify.error({
            title: '错误',
            message: '系统输入验证失败！'
          });
          return false;
        }
      });
    },
  }
}
</script>
