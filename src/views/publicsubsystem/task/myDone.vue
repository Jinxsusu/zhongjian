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
  extends: baseView,
  name: 'myDone',
  data() {
    return {
      checkededRows: [],
      processDefinationlist: [],
      startDateRange: null,
      gridOptions: {
        dataSource: {
          serviceInstance: tapp.services.wF_ProcessInst.getMyDonePagedList,
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
              label: '详情',
              render: this.renderTaskBtnLabel,
              method: this.doView,
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
              prop: 'endDate',
              label: '结束日期',
              sortable: true,
              width: 110,
              formatter: (row, column, cellValue) => {
                return this.$util.dateFormat(row.endDate, 'YYYY-MM-DD');
              }
            },
            {
              prop: 'folio',
              label: '单据描述',
              sortable: true,
              minWidth: 120,
            },
            {
              prop: 'status',
              columnKey: 'status',
              label: '状态',
              sortable: true,
              width: 90,
              filters: [{
                text: '审批中',
                value: 'Approving'
              }, {
                text: '驳回提单',
                value: 'ReRequest'
              }, {
                text: '审批完成',
                value: 'Finished'
              }, {
                text: '拒绝',
                value: 'Declined'
              }],
              formatter: (row, column, cellValue) => {
                switch (row.status) {
                  case 'Approving':
                    return '审批中';
                  case 'ReRequest':
                    return '驳回提单';
                  case 'Finished':
                    return '审批完成';
                  case 'Declined':
                    return '拒绝';
                  default:
                    return row.status;
                }
              },
            },
            {
              prop: 'taskInfo',
              label: '任务信息',
              sortable: false,
              minWidth: 250,
              render: (h, params) => {
                let row = params.row;
                if (!row.tasklist) {
                  return h('');
                }
                let wfTasks = row.tasklist;
                wfTasks.forEach(p=>{
                  p.processInstStatus = row.status;
                  p.processDefinationKey = row.processDefinationKey;
                })

                return h('wf-taskinfo', {
                  props: {
                    tasklist: wfTasks,
                    disabled:true,
                  }, // 组件的props
                })
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
    doView(key, row) {
      let path = row.procInstViewUrl + '?id=' + row.businessId + '&procInstId=' + row.processInstId;
      //查看详情
      this.$router.push({
        path
      });
      return;
    },
    handleSelectionChange(val) {
      this.checkededRows = val;
    },

    doExportExcel() {
      this.$refs.searchReulstList.exportCSV('已办列表');
    },
    doRefresh() {
      this.$refs.searchReulstList.refresh();
    }
  }
}
</script>
