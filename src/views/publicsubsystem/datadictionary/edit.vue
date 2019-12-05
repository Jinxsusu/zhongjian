
<template>
<el-dialog  :title="title" :close-on-click-modal="false" :visible.sync="visible" width="30%">
  <el-form :model="model" ref="ruleForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="编码" prop="id">
      <t-input v-model="model.id" :readOnly="true"></t-input>
    </el-form-item>
    <el-form-item label="名称" prop="name" verify :maxLength="32" class="is-required">
      <el-input v-model="model.name"></el-input>
    </el-form-item>
    <el-form-item label="备注" prop="remark" verify can-be-empty :maxLength="200">
      <el-input type="textarea" v-model="model.remark"></el-input>
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
      formAction: 0, //0 add,//1,edit
      visible: false,
      categoryId: null,
      categoryName: null,
      parentId: null,
      parentName: null,
      model: {},
    };
  },
  computed: {
    title: function() {
      if (this.docId) {
        return '修改字典项';
      } else {
        return this.parentId == null ? '新增根结点-字典项'+this.categoryName : '新增子结点-字典项' + this.parentName;
      }
    }
  },
  created() {


  },
  activated() {},
  methods: {
    init(parentId, parentName, categoryId,categoryName, id) {
      this.visible = true;
      this.categoryId = categoryId;
      this.categoryName = categoryName;
      this.parentId = parentId;
      this.parentName = parentName;
      if (id) {
        let self = this;
        tapp.services.base_DataDictionary.getDataDictionay(id).then(function(result) {
          self.model = result;
          self.$refs.ruleForm.resetFields();
          self.formAction = 1;
        });
      } else {
        this.model = {};
        this.model.dataDictionaryCategoryId = categoryId;
        this.model.parentId = parentId;
        this.$nextTick(() => {
          this.$refs.ruleForm.resetFields();
          this.formAction = 0;
        });
      }
    },
    dataFormSubmit() {
      let self = this;
      self.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          let model = self.model;
          model.sortIndex = 0;
          tapp.services.base_DataDictionary.save(model).then(function(result) {
            self.model.id = result.id;
            self.formAction = 1;
            self.$notify.success({
              title: '操作成功',
              message: '保存成功，注销后重新登陆系统后修改生效！',
              duration: 1500,
              onClose: () => {
                self.visible = false;
                self.$emit('change');
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
    doDelete() {
      let self = this;
      self.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        tapp.services.base_DataDictionary.delete(self.model.id).then(function(result) {
          self.formAction = 0;

          self.$notify.success({
            title: '操作成功',
            message: '删除成功，注销后重新登陆系统后修改生效！',
            duration: 1500,
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
