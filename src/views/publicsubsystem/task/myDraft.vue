
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
        <el-form-item label="保存日期">
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
          <el-button icon="el-icon-delete" type="danger" @click="doBatchDelete()" :disabled="selectedRows.length <= 0">批量删除</el-button>
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
  name: 'myDraft',
      extends:baseView,
  data() {
    return {
      processDefinationlist: [],
      startDateRange: null,
      selectedRows: [],
      gridOptions: {
        dataSource: {
          serviceInstance: tapp.services.wF_Draft.getMyDraftPagedList,
          serviceInstanceInputParameters: {
            searchKey: null,
          }
        },
        grid: {
          mutiSelect: true,
          operates: {
            width: 60,
            fixed: 'right',
            list: [{
              type: 'text',
              show: true,
              label: '查看',
              method: this.doEdit,
            }, ]
          }, // 列操作按钮
          columns: [{
              prop: 'processDefinationName',
              columnKey: 'processDefinationKey',
              label: '流程名称',
              sortable: true,
              width: 120,
            },
            {
              prop: 'origiatorName',
              columnKey: 'origiator',
              label: '申请人',
              sortable: true,
              width: 120,
            },
            {
              prop: 'saveDate',
              columnKey: 'saveDate',
              label: '保存日期',
              sortable: true,
              width: 120,
              formatter: (row, column, cellValue) => {
                return this.$util.dateFormat(row.saveDate);
              }
            }, {
              prop: 'folio',
              columnKey: 'folio',
              label: '单据描述',
              sortable: true,
              minWidth: 120,
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
      this.gridOptions.dataSource.serviceInstanceInputParameters.saveDateBegin = val[0];
      this.gridOptions.dataSource.serviceInstanceInputParameters.saveDateEnd = val[1];
    },

    doEdit(key, row) {
      let path = row.procInstDraftUrl + '?id=' + row.businessId;
      this.$router.push({
        path: path,
      });
    },
    handleSelectionChange(val) {
      this.selectedRows = val;
    },
    doBatchDelete() {
      let self = this;
      if (!self.selectedRows || self.selectedRows.length == 0) {
        self.$notify.info({
          title: '系统提示',
          message: '您没选择任何行，无法操作！'
        });
        return;
      }
      let ids = self.selectedRows.map(function(row) {
        return row.id;
      });
      self.$confirm('此操作将永久删除' + ids.length + '个草稿, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        tapp.services.wF_Draft.batchDelete(ids).then(function(result) {
          self.$notify.success({
            title: '系统删除成功',
            message: '草稿已删除成功！'
          });
          self.$refs.searchReulstList.refresh();
        })
      });
    },
    doExportExcel() {
      this.$refs.searchReulstList.exportCSV('草稿列表');
    },
    doRefresh() {
      this.$refs.searchReulstList.refresh();
    }
  }
}
</script>
