<template>
<div>
  <el-tabs v-model="tabActive" @tab-click="handleTabClick" tab-position="right" class="fixed-header">
    <el-tab-pane label="申请信息" name="baseInfo">
      <computer-roomInfo-uc v-model="model" :readOnly="readOnly" ref="computerRoomInfoUc" />
    </el-tab-pane>
    <el-tab-pane label="审批过程" name="processtrack" v-if=" taskId !=null && taskId.length>0 ">
      <div style="margin-bottom:20px;">
        <wf-processtrack ref="processtrack" :procInstId="procInstId" v-if="tabActive =='processtrack'">
        </wf-processtrack>
      </div>
    </el-tab-pane>
  </el-tabs>
  <el-row :gutter="20" style="margin-top:20px" v-loading="isLoading">
    <el-col :span="24">
      <div style="float:right" v-if="formResult == 0" class="t-form-footer">
        <el-button @click="doSave()">保存</el-button>
        <el-button type="primary" @click="doSubmit()">提交</el-button>
        <el-button type="danger" @click="doDelete()" :disabled=" formAction == 0">放弃</el-button>
      </div>
    </el-col>
  </el-row>
</div>
</template>
<script>
import {
  mapMutations,
  mapState,
} from 'vuex'
import moment from 'moment';
import baseView from '@/base/baseView'
import computerRoomInfoUc from './computerRoomInfoUc.vue'
export default {
  extends: baseView,
  data() {
    return {
      readOnly: false,
      tabActive: 'baseInfo',
      procInstId: null,
      taskId: null,
      docId: null,
      model: {},
      formAction: 0, // 0：add,1:edit
      formResult: 0, //0:待处理，1:处理完成
    }
  },
  activated() {
    this.$nextTick((_)=>{
      if (this.routeChanged) {
        this.load();
      }
    }); 
  },
  components: {
    computerRoomInfoUc
  },
  created() {}, 
  computed: {
    ...mapState({
      currentUser: state => state.app.user,
    }),
    title: function() {
      return this.formAction == 0 ? '新增机房审批' : '修改机房审批';
    }
  },
  methods: {
    handleTabClick(tab, event) {
      if (!tab) {
        return;
      }
      this.tabActive = tab.name;
    },
    clearValidate() {
      this.$nextTick((_) => {
        this.$refs.computerRoomInfoUc.clearValidate();
      });
    },
    load() {
      this.docId = this.$route.query.id;
      this.taskId = this.$route.query.taskId;
      this.procInstId = this.$route.query.procInstId;
      this.$util.ui.title(this.title);

      let self = this;
      if (self.docId) {
        tapp.services.pL_ComputerRoomApplyHeader.get(self.docId).then(function(result) {
          self.model = {
            headerEntity: { ...result
            },
            maintainInfoList: result.maintainInfoList
          };
          delete self.model.headerEntity.maintainInfoList;
          self.formAction = 1;
          self.clearValidate();
        });
      } else {
        self.model = {
          headerEntity: {
            id: null,
            requestDate: self.$util.datetimeFormat(moment()),
            requesterId: self.currentUser.userId,
            requesterName: self.currentUser.userDisplayName,
            requesterMobile: self.currentUser.userMobile,
            requesterDeptId: self.currentUser.userDepartmentlist != null && self.currentUser.userDepartmentlist.length > 0 ? self.currentUser.userDepartmentlist[0].key : '',
            requesterDeptName: self.currentUser.userDepartmentlist != null && self.currentUser.userDepartmentlist.length > 0 ? self.currentUser.userDepartmentlist[0].value : '',
          },
          maintainInfoList: []
        };
        self.formAction = 0;
        self.clearValidate();
      }
    },
    doSave() {
      let self = this;

      let data = self.$refs.computerRoomInfoUc.getData();
      let headerEntity = data.headerEntity || {};
      let maintainInfoList = data.maintainInfoList || [];

      let requestModel = { ...data.headerEntity
      };

      requestModel.maintainInfoList = maintainInfoList.list;
      requestModel.deletedMaintainInfoListIds = maintainInfoList.deletedIdList;
      tapp.services.pL_ComputerRoomApplyHeader.saveDraft(requestModel).then(function(result) {
        self.model = {
          headerEntity: { ...result
          },
          maintainInfoList: result.maintainInfoList
        };
        delete self.model.headerEntity.maintainInfoList;
        self.formAction = 1;

        self.$notify.success({
          title: '操作成功！',
          message: '保存机房审批成功！',
        });
      });

    },
    doSubmit() {
      let self = this;
      let validPromises = self.$refs.computerRoomInfoUc.validate();
      Promise.all(validPromises)
        .then(resultList => {
          let data = self.$refs.computerRoomInfoUc.getData();
          let headerEntity = data.headerEntity || {};
          let maintainInfoList = data.maintainInfoList || [];

          let requestModel = { ...data.headerEntity
          };
          requestModel.maintainInfoList = maintainInfoList.list;
          requestModel.deletedMaintainInfoListIds = maintainInfoList.deletedIdList;
          requestModel.sn = self.taskId;
          requestModel.procInstId = self.procInstId;

          tapp.services.pL_ComputerRoomApplyHeader.submit(requestModel).then(function(result) {
            self.model = {
              headerEntity: { ...result
              },
              maintainInfoList: result.maintainInfoList
            };
            delete self.model.headerEntity.maintainInfoList;
            self.formResult = 1;
            self.formAction = 1;
            self.$notify.success({
              title: '操作成功！',
              message: '提交成功！',
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
      self.$confirm('此操作将永久删除机房审批, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        tapp.services.pL_ComputerRoomApplyHeader.delete(self.docId).then(function(result) {
          self.formResult = 1;
          self.formAction = 1;
          self.$util.closeCurrentTabNav('pl_computerroomapplyheaderlist');
          self.$notify.success({
            title: '系统删除成功',
            message: '机房审批已删除成功！'
          });

        })
      });
    },
  }
}
</script>
