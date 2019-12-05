<template>
<div class="mod-role">
  <el-form @keyup.enter.native="doRefresh()" label-width="120px">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-form-item label="流程类别">
          <el-select placeholder="请选择流程类别" v-model="gridOptions.dataSource.serviceInstanceInputParameters.processDefinationKey" clearable>
            <el-option v-for="(item, index) in processDefinationlist" :key='item.key' :label="item.name" :value="item.key"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="14">
        <el-form-item label="流程发起时间">
          <t-datetime-range-picker v-model="startDateRange" @change="onStartDateRangeChanged">
          </t-datetime-range-picker>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-form-item label="关键字">
          <el-input @keyup.enter.native="doRefresh()" v-model="gridOptions.dataSource.serviceInstanceInputParameters.searchKey" placeholder="单据描述" clearable></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="14">
        <el-form-item>
          <el-button @click="doRefresh()" icon="el-icon-search">查询</el-button>
          <el-button icon="el-icon-download" @click="doExportExcel()">
            <i class="fa fa-lg fa-level-down"></i>导出
          </el-button>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
  <t-grid ref="searchReulstList" :options="gridOptions" @selection-change="handleSelectionChange">
  </t-grid>
</div>
</template>
<script>
import baseView from '@/base/baseView'
export default {
  name: 'myTask',
  extends: baseView,
  data() {
    return {
      checkededRows: [],
      processDefinationlist: [],
      startDateRange: null,
      gridOptions: {
        dataSource: {
          serviceInstance: tapp.services.wF_ProcessInst.getMyTaskPagedList,
          serviceInstanceInputParameters: {
            searchKey: null,
          }
        },
        grid: {
          mutiSelect: false,
          operates: {
            width: 60,
            fixed: 'right',
            list: [{
              type: 'text',
              show: true,
              label: '办理',
              render: this.renderTaskBtnLabel,
              method: this.doTask,
            }, ]
          }, // 列操作按钮
          columns: [{
              prop: 'processDefinationName',
              label: '流程名称',
              sortable: true,
              width: 200,
            },
            {
              prop: 'origiatorName',
              label: '提单人',
              sortable: true,
              width: 100,
            },
            {
              prop: 'startDate',
              label: '提单日期',
              sortable: true,
              width: 110,
              formatter: (row, column, cellValue) => {
                return this.$util.dateFormat(row.startDate, 'YYYY-MM-DD');
              }
            },
            {
              prop: 'folio',
              label: '单据描述',
              sortable: true,
              minWidth: 120,
            },
            {
              prop: 'taskActName',
              label: '审批结点',
              sortable: true,
              width: 100,
            },
            {
              prop: 'taskAssigneeName',
              label: '审批人',
              sortable: true,
              width: 100,
            },
            {
              prop: 'taskCreateDate',
              label: '任务创建时间',
              sortable: true,
              width: 150,
              formatter: (row, column, cellValue) => {
                return this.$util.datetimeFormat(row.taskCreateDate);
              }
            },
          ], // 需要展示的列
          defaultSort: {
            prop: 'id',
            order: 'descending'
          },
        }
      }
    }
  },
  components: {},
  created() {
    this.loadProcessDefList();
  },
  methods: {
    loadProcessDefList() {
      let self = this;
      tapp.services.wf_Model.getMadelList().then(function(result) {
        self.processDefinationlist = result;
      })
    },
    onStartDateRangeChanged(val) {
      this.gridOptions.dataSource.serviceInstanceInputParameters.startDateBegin = val[0];
      this.gridOptions.dataSource.serviceInstanceInputParameters.startDateEnd = val[1];
    },
    renderTaskBtnLabel(key, row) {
      if (row.taskAssignee != null && row.taskAssignee.length > 0) {
        return "办理";
      } else if (row.taskCandidate != null && row.taskCandidate.length > 0) {
        return "签收";
      }
      return "未知";
    },
    doTask(key, row) {
      if (row.taskAssignee != null && row.taskAssignee.length > 0) {
        //办理
        this.$router.push({
          path: row.taskFormUrl,
        });
        return;
      } else if (row.taskCandidate != null && row.taskCandidate.length > 0) {
		let self = this;
        // "签收";
        tapp.services.wF_Workflow.handleTask({
          taskId: row.taskId,
          claim: true,
          action: 'claim',
          taskRemark: '签收',
          docId: row.businessId
        }).then(function(result) {
          self.doRefresh();
          self.$notify.success({
            title: '操作成功！',
            message: '签收任务成功！',
          });
        });
      } else {
        alert('do what?')
      }
    },
    handleSelectionChange(val) {
      this.checkededRows = val;
    },

    doExportExcel() {
      this.$refs.searchReulstList.exportCSV('流程实例列表');
    },
    doRefresh() {
      this.$refs.searchReulstList.refresh();
    }
  }
}
</script>
