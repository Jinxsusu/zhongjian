
<template>
<div>
  <el-tabs v-model="tabActive" @tab-click="handleTabClick" tab-position="right" class="fixed-header">
    <el-tab-pane label="申请信息" name="baseInfo">
      <computer-roomInfo-uc v-model="model" :readOnly="readOnly" ref="computerRoomInfoUc" />
      <el-form ref="ruleForm" :model="taskEntity" label-width="160px" style="margin-top:20px">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="审批意见" prop="taskRemark" verify can-be-empty :maxLength="400">
              <el-input type="textarea" :rows="3" v-model="taskEntity.taskRemark"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" v-loading="isLoading"  style="margin-top:20px">
          <el-col :span="24">
            <div  v-if="formResult == 0" class="t-form-footer">
              <el-button type="primary" @click="doApprove()">提交</el-button>
              <el-button type="danger" @click="gotoOriginator()">驳回</el-button>
              <el-button type="danger" @click="doDecline()">拒绝</el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </el-tab-pane>
    <el-tab-pane label="审批过程" name="processtrack" v-if=" taskId !=null && taskId.length>0 ">
      <div style="margin-bottom:20px;">
        <wf-processtrack ref="processtrack" :procInstId="procInstId" v-if="tabActive =='processtrack'">
        </wf-processtrack>
      </div>
    </el-tab-pane>
  </el-tabs>
</div>
</template>

<script>
import baseView from '@/base/baseView'
import computerRoomInfoUc from './computerRoomInfoUc.vue'

export default {
  extends: baseView,
  data() {
    return {
      readOnly: true,
      tabActive: 'baseInfo',
      procInstId: null,
      taskId: null,
      docId: null,
      model: {},
      taskEntity: {},
      formResult: 0, //0:待处理，1:处理完成
    }
  },
  components: {
    computerRoomInfoUc
  },
  created() {},
  activated() {
    this.$nextTick((_)=>{
      if (this.routeChanged) {
        this.load();
      }
    }); 
  }, 
  computed: {},
  methods: {
    handleTabClick(tab, event) {
      if (!tab) {
        return;
      }
      this.tabActive = tab.name;
    },
    load() {

      Object.assign(this.$data, this.$options.data());
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
        });
      } else {
        alert('error');
      }
    },
    doApprove() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          let self = this;
          let model = {
            taskId: self.taskId,
            action: 'approve',
            taskRemark: self.taskEntity.taskRemark,
            docId: self.docId,
            result: '审批通过'
          };
          tapp.services.pL_ComputerRoomApplyHeader.approve(model).then(function(result) {
            self.formResult = 1;
            self.$notify.success({
              title: '操作成功！',
              message: '办理机房审批成功！！',
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
    gotoOriginator() {
      let self = this;
      self.$confirm('确认要驳回提单人?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let model = {
          taskId: self.taskId,
          action: 'request',
          taskRemark: self.taskEntity.taskRemark,
          docId: self.docId,
          result: '驳回提单人'
        };
        tapp.services.pL_ComputerRoomApplyHeader.gotoOriginator(model).then(function(result) {
          self.formResult = 1;
          self.$notify.success({
            title: '系统驳回提单人成功',
            message: '驳回提单人成功！'
          });
        })
      });
    },
    doDecline() {
      let self = this;
      self.$confirm('此操作将拒绝机房审批, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {

        let model = {
          taskId: self.taskId,
          action: 'decline',
          taskRemark: self.taskEntity.taskRemark,
          docId: self.docId,
          result: '拒绝'
        };
        tapp.services.pL_ComputerRoomApplyHeader.decline(model).then(function(result) {
          self.formResult = 1;
          self.$notify.success({
            title: '系统拒绝成功',
            message: '机房审批已拒绝成功！'
          });
        })
      });
    },
  }
}
</script>
