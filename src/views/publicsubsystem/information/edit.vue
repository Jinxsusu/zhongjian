<template>
<div>
  <el-form :model="model" ref="ruleForm" @keyup.enter.native="doSave()" label-width="140px">
    <el-row :gutter="20" v-if="showFieldList.includes('title')">
      <el-col :span="24">
        <el-form-item label="标题" prop="title" verify class="is-required" :maxLength="50">
          <el-input v-model="model.title"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="20" v-if="showFieldList.includes('summary')">
      <el-col :span="24">
        <el-form-item label="概述" prop="summary" verify class="is-required" :maxLength="200">
          <el-input v-model="model.summary"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="20" v-if="showFieldList.includes('image')">
      <el-col :span="24">
        <el-form-item label="图片">
          <base-asset-single-management ref="assetManagement" assetCategory="base_information" :businessDocId="model.id">
          </base-asset-single-management>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="20" v-if="showFieldList.includes('content')">
      <el-col :span="24">
        <el-form-item label="内容" prop="content" :maxLength="4000">
          <t-editor v-model="model.content" :zindex="1"></t-editor>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="20" v-if="showFieldList.includes('linkUrl')">
      <el-col :span="24">
        <el-form-item label="链接地址" prop="linkUrl" :maxLength="200">
          <el-input v-model="model.linkUrl"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="24">
        <el-form-item label="状态" prop="status" verify class="is-required" :maxLength="50">
          <t-dic-radio-select dicType="base_information_status" v-model="model.status"></t-dic-radio-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-top:25px">
      <el-col :span="24">
        <div style="float:right">
          <el-button @click="doSave()">保存</el-button>
          <el-button :disabled="formAction == 0" type="danger" @click="doDelete()">删除</el-button>
        </div>
      </el-col>
    </el-row>
  </el-form>
</div>
</template>
<script>
import {
  mapMutations,
  mapState,
} from 'vuex'
export default {
  data() {
    return {
      docId: null,
      classificationId: null,
      showFieldList: [],
      model: {},
      formAction: 0, // 0：add,1:edit
    }
  },
  components: {},
  created() {
    this.docId = this.$route.query.id;
    this.classificationId = this.$route.query.cid;
    this.$util.ui.title(this.title);
    this.load();
  },
  activated() {},
  computed: {
    ...mapState({
      //currentUser: state => state.app.user,
    }),
    title: function() {
      return this.formAction == 0 ? '新增信息公告' : '修改信息公告';
    }
  },
  methods: {
    async load() {
      let self = this;

      let classificationInfo = await tapp.services.base_InformationClassification.get(self.classificationId);
      self.showFieldList = classificationInfo.showFieldList;

      if (self.docId) {
        self.model = await tapp.services.base_Information.get(self.docId);
        self.formAction = 1;
      } else {
        let uuids = await tapp.services.base_Common.getSUIds(1);

        self.model.id = uuids[0];
        self.model.classificationId = self.classificationId;
        self.formAction = 0;
      }
    },
    doSave(formName) {
      let self = this;
      let validPromises = [self.$refs['ruleForm'].validate()];
      Promise.all(validPromises).then(resultList => {
        let requestModel = { ...self.model
        };
        tapp.services.base_Information.save(requestModel).then(function(result) {
          self.model = result;
          self.formAction = 1;
          self.$notify.success({
            title: '操作成功！',
            message: '保存信息公告成功！',
          });
        });
      }).catch(function(e) {
        self.$notify.error({
          title: '错误',
          message: '系统输入验证失败！'
        });
        return false;

      });
    },
    doDelete() {
      let self = this;
      self.$confirm('此操作将永久删除信息公告, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        tapp.services.base_Information.delete(self.docId).then(function(result) {
          self.formAction = 1;
          self.$util.closeCurrentTabNav('base_informationlist');
          self.$notify.success({
            title: '系统删除成功',
            message: '信息公告已删除成功！'
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
