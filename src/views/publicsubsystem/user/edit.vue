<template>
<el-dialog :title="formAction == 0 ? '新增用户信息' : '修改用户信息'" :close-on-click-modal="false" :visible.sync="visible">
  <el-tabs v-model="tabActive" @tab-click="handleTabClick">
    <el-tab-pane label="基本信息" name="userInfo">
      <el-form :model="model" ref="ruleForm" label-width="100px" v-show="tabActive =='userInfo'">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="登陆名" prop="loginId" verify :maxLength="50" class="is-required">
              <el-input v-model="model.loginId"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="密码" prop="loginPassword" v-if="formAction == 0 " :maxLength="128" class="is-required">
              <el-input v-model="model.loginPassword" type="password"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="姓名" prop="name" verify :maxLength="50" class="is-required">
              <el-input v-model="model.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="mobile" label="手机" verify can-be-empty :maxLength="45">
              <el-input v-model="model.mobile"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email" verify can-be-empty :maxLength="45">
              <el-input v-model="model.email"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="微信" prop="weixin" verify can-be-empty :maxLength="50">
              <el-switch v-model="model.weixin"></el-switch>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" v-if="formAction == 1 ">
          <el-col :span="24">
            <el-form-item label="外部访问秘钥" prop="token" verify can-be-empty :maxLength="500">
              <el-input v-model="model.token" :readOnly="true">
                <el-button slot="append" @click="genExportToken()">生成</el-button>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="是否启用" prop="activited" verify>
              <el-switch v-model="model.activited"></el-switch>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col>
            <el-form-item label="备注" prop="remark" verify can-be-empty :maxLength="200">
              <el-input :autosize="{ minRows: 2, maxRows: 4}" v-model="model.remark"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-tab-pane>
    <el-tab-pane label="所属岗位" name="roleInfo">
      <t-tree ref="userRoleTree" :options="userRoleTreeOptons" v-show="tabActive =='roleInfo'">
      </t-tree>
    </el-tab-pane>
  </el-tabs>
  <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    <el-button @click="doClose()">取消</el-button>
  </span>
</el-dialog>
</template>
<script>
export default {
  data() {


    return {
      formAction: 0, //0 add,//1,edit
      visible: false,
      tabActive: 'userInfo',
      model: {
        activited: true
      },
      userRoleTreeOptons: {
        dataSource: {
          serviceInstance: tapp.services.base_Role.getOrgRoleTree,
          serviceInstanceInputParameters: {}
        },
        tree: {
          nodeKey: 'id',
          defaultCheckedKeys: []
        }
      }
    };
  },
  created() {

  },
  activated() {},
  methods: {
    init(id) {
      this.visible = true;
      this.tabActive = 'userInfo';
      let self = this;
      if (id) {
        tapp.services.base_User.getUser(id).then(function(result) {
          self.model = result;
          self.$refs.ruleForm.resetFields();
          self.$refs.userRoleTree.setCheckedKeys(result.roleIds);
          self.formAction = 1;
        });
      } else {
        self.model = {
          activited: true
        };

        self.$nextTick(() => {
          self.$refs.ruleForm.resetFields();
          self.$refs.userRoleTree.setCheckedKeys([]);
          self.formAction = 0;
        })
      }
    },

    handleTabClick(tab, event) {
      if (!tab) {
        return;
      }
      this.tabActive = tab.name;
    },
    genExportToken() {
      let self = this;
      tapp.services.base_User.genExportToken(self.model.id).then(function(result) {
        self.model = result;
        self.$notify.success({
          title: '外部访问秘钥生成成功',
          duration: 1500,
          message: '外部访问秘钥生成成功！',
          onClose: () => {
          }
        });
      })
    },
    dataFormSubmit() {
      if (this.formAction == 0) {
        if (!(/^(?![0-9]+$)(?![a-zA-Z]+$)(?!(.)\1{5}).{6,16}$/.test(this.model.loginPassword))) {
          this.$notify.error({
            title: '系统输入验证失败',
            message: '密码强度弱，长度必须在6位和16位数之间，包含字母数字！'
          });
          return;
        }
      }
      let self = this;
      self.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          let model = self.model;
          model.roleIds = self.$refs.userRoleTree.getCheckedKeys();
          if (model.roleIds.length <= 0) {
            self.$notify.error({
              title: '错误',
              message: '请选择岗位！'
            });
            return false;
          }
          tapp.services.base_User.saveUser(model).then(function(result) {
            self.model = result;
            self.formAction = 1;
            self.$notify.success({
              title: '操作成功',
              message: '用户信息已保存成功！',
              duration: 1500,
              onClose: () => {
              }
            });
          });

        } else {
          self.$notify.error({
            title: '错误',
            message: '系统输入验证失败！'
          });
          return false;
        }
      });
    },

    doClose(){

                this.visible = false;
                this.$emit('change');
    },
    doDelete() {
      let self = this;
      self.$confirm('此操作将永久删除用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        tapp.services.base_User.delete(self.model.id).then(function(result) {
          self.formAction = 0;
          self.$notify.success({
            title: '系统删除成功',
            duration: 1500,
            message: '用户信息已删除成功！',
            onClose: () => {
              self.visible = false;
              self.$emit('change');
            }
          });
        })
      });
    },
  }
}
</script>
