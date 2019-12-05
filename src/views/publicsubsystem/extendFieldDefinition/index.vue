
<template>
<div class="mod-role">
  <el-form :inline="true" @keyup.enter.native="doRefresh()" >
    <el-form-item>
      <el-button type="primary" @click="doNew()" icon="el-icon-plus">新增</el-button>
      <el-button icon="el-icon-delete" type="danger" @click="doBatchDelete()" :disabled="selectedRows.length <= 0">批量删除</el-button>
      <el-button icon="el-icon-download" @click="doExportExcel()">
        <i class="fa fa-lg fa-level-down"></i>导出
      </el-button>
    </el-form-item>
  </el-form>
  <t-grid ref="searchReulstList" :options="gridOptions" @selection-change="handleSelectionChange">
  </t-grid>
  <edit-form v-if="editFormVisible" ref="editForm" @change="doRefresh"></edit-form>
</div>
</template>
<script>
import EditForm from './designer'
import baseView from '@/base/baseView'
export default {
  extends:baseView,
  data() {
    return {
      editFormVisible: false,
      selectedRows: [],
      gridOptions: {
        dataSource: {
          serviceInstance: tapp.services.base_ExtendFieldDefinition.getPagedList,
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
          columns: [
            {
              prop: 'id',
              columnKey: 'id',
              label: '编码',
              sortable: true,
              minWidth: 120,
            },
            {
              prop: 'name',
              columnKey: 'name',
              label: '名称',
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
  components: {
    EditForm,
  },
  created() {

  },
  methods: {

    doNew() {
      this.editFormVisible = true;
      this.$nextTick(() => {
        this.$refs.editForm.init(null, null);
      })
    },
    doEdit(key, row) {
      this.editFormVisible = true
      this.$nextTick(() => {
        this.$refs.editForm.init(row.id);
      })
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
      self.$confirm('此操作将永久删除' + ids.length + '个扩展字段定义, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        tapp.services.base_ExtendFieldDefinition.batchDelete(ids).then(function(result) {
          self.$notify.success({
            title: '系统删除成功',
            message: '扩展字段定义已删除成功！'
          });
          self.$refs.searchReulstList.refresh();
        })
      });
    },
    doExportExcel() {
      this.$refs.searchReulstList.exportCSV('扩展字段定义列表');
    },
    doRefresh() {
      this.$refs.searchReulstList.refresh();
    }
  }
}
</script>
