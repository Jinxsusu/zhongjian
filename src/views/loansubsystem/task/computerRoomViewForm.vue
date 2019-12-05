
<template>
<div>
  <el-tabs v-model="tabActive" @tab-click="handleTabClick" tab-position="right" class="fixed-header">
    <el-tab-pane label="申请信息" name="baseInfo">
      <computer-roomInfo-uc v-model="model" :readOnly="readOnly" ref="computerRoomInfoUc" />
    </el-tab-pane>
    <el-tab-pane label="审批过程" name="processtrack">
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
    }
  },
  components: {
    computerRoomInfoUc
  },
  created() {

  },
  watch: {

  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.load();
    })
  },
  activated() {},
  computed: {},
  methods: {
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
    handleTabClick(tab, event) {
      if (!tab) {
        return;
      }
      this.tabActive = tab.name;
    },
  }
}
</script>
