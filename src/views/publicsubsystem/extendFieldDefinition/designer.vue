<template>
<el-dialog :title="title" :close-on-click-modal="false" :visible.sync="visible" width="100%">
  <div class="fm-container">
    <t-form-designer ref="formDesigner">
    </t-form-designer>
  </div>

  <span slot="footer" class="dialog-footer">

  <el-form :model="model" :inline="true" ref="ruleForm" @keyup.enter.native="doSave()" label-width="100px">
    <el-form-item label="名称" prop="name" verify class="is-required" :maxLength="50">
      <el-input v-model="model.name"></el-input>
    </el-form-item>
    <el-form-item >
          <el-button type="primary" @click="doSave()">确定</el-button>
	<el-button :disabled="formAction == 0" type="danger" @click="doDelete()">删除</el-button>
    <el-button @click="doClose()">取消</el-button>
    </el-form-item>
  </el-form>
  </span>
</el-dialog>
</template>

<script>
import {
  mapMutations,
  mapState,
} from 'vuex'


export default {
  data() {
    return {
      visible: false,
      docId: null,
      model: {},
      formAction: 0, // 0：add,1:edit
    }
  },
  components: {},
  created() {},
  activated() {},
  computed: {
    ...mapState({
      //currentUser: state => state.app.user,
    }),
    title: function() {
      return this.formAction == 0 ? '新增扩展字段定义' : '修改扩展字段定义';
    }
  },
  methods: {
    load() {
      let self = this;
      if (self.docId) {
        tapp.services.base_ExtendFieldDefinition.get(self.docId).then(function(result) {
          self.model = result;
          self.formAction = 1;
          self.$refs.formDesigner.setJSON(self.model.json);
        });
      } else {
        self.model.id = null;
        this.$nextTick(() => {
          self.$refs.formDesigner.setJSON(null);
        })
        self.formAction = 0;
      }
    },
    init(id) {
      this.visible = true;
      this.docId = id;
      this.$nextTick(() => {
        this.$refs.ruleForm.resetFields();
      })
      this.load();
    },
    doSave(formName) {
      let self = this;
      let validPromises = [self.$refs['ruleForm'].validate()];
      Promise.all(validPromises)
        .then(resultList => {
          let requestModel = { ...self.model
          };
          requestModel.json = self.$refs.formDesigner.getJSON();

          tapp.services.base_ExtendFieldDefinition.save(requestModel).then(function(result) {
            self.model = result;
            self.formAction = 1;
            self.$notify.success({
              title: '操作成功！',
              message: '保存扩展字段定义成功，注销后重新登陆系统后修改生效！',
            });
          });
        }).catch(function(e) { //验证失败 
          self.$notify.error({
            title: '错误',
            message: '系统输入验证失败！'
          });
          return false;
        });
    },
    doDelete() {
      let self = this;
      self.$confirm('此操作将永久删除扩展字段定义, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        tapp.services.base_ExtendFieldDefinition.delete(self.docId).then(function(result) {
          self.formAction = 1;
          self.doClose();
          self.$notify.success({
            title: '系统删除成功',
            message: '扩展字段定义已删除成功，注销后重新登陆系统后修改生效！'
          });

        })
      });
    },
    doClose() {
      this.visible = false;
      this.$emit('change');
    },
  }
}
</script>
<style lang="scss">
.fm-container {
    height: calc(100% - 50px);
}
*,
:after,
:before {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
}
</style>
