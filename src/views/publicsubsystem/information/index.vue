
<template>
<div>
  <el-row :gutter="20">
    <el-col :span="9">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>栏2222目</span>
        </div>
        <div class="text item">
          <t-tree ref="categoryTree" :options="categoryTreeOptons" @node-click="handleNodeClick" @node-drop="handleDrop">
          </t-tree>
        </div>
      </el-card>
    </el-col>
    <el-col :span="15">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>{{selectedCategoryItemName}}-项</span>
          <div style="float: right; padding: 3px 0">
            <el-button type="primary" icon="el-icon-plus" @click="doNew()" :disabled="selectedCategoryItem ==null">新增</el-button>
            <el-button type="danger" icon="el-icon-delete" @click="doBatchDelete()" :disabled="selectedItems.length <= 0">批量删除</el-button>
            <el-button icon="el-icon-download" @click="doExportExcel()">导出</el-button>
          </div>
        </div>
        <div class="text item">
          <t-grid ref="searchReulstList" :options="gridOptions" @selection-change="handleSelectionChange">
          </t-grid>
        </div>
      </el-card>
    </el-col>
  </el-row>
</div>
</template>
<script>
import baseView from '@/base/baseView'
export default {
  extends: baseView,
  data () {
    return {
      editFormVisible: false,
      selectedItems: [],
      selectedCategoryItem: null,
      categoryTreeOptons: {
        dataSource: {
          serviceInstance: tapp.services.base_InformationClassification.getTreeList,
          serviceInstanceInputParameters: {}
        },
        tree: {
          draggable: true,
          showCheckbox: false,
          defaultCheckedKeys: []
        }
      },
      gridOptions: {
        dataSource: {
          loadDataOnFirst: false,
          serviceInstance: tapp.services.base_Information.getPagedList,
          serviceInstanceInputParameters: {
            searchKey: null
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
              method: this.doEdit
            } ]
          }, // 列操作按钮
          columns: [{
            prop: 'title',
            columnKey: 'title',
            label: '标题',
            sortable: true,
            minWidth: 120
          },
          {
            prop: 'gmtCreatedOn',
            label: '日期',
            sortable: true,
            width: 150,
            formatter: (row, column, cellValue) => {
                return this.$util.datetimeFormat(row.gmtCreatedOn)
              }
          },
          {
            prop: 'status',
            columnKey: 'status',
            label: '状态',
            sortable: true,
            width: 100,
            filters: this.$util.getListDataDicFilters('base_information_status'),
            formatter: (row, column, cellValue) => {
                return this.$util.dataDicFormat('base_information_status', row.status)
              }
          }
          ], // 需要展示的列
          defaultSort: {
            prop: 'id',
            order: 'descending'
          }
        }
      }
    }
  },
  components: {

  },
  created () {

  },
  computed: {
    selectedCategoryItemName () {
      if (this.selectedCategoryItem == null ||
        this.selectedCategoryItem.name == null) {
        return '未选择栏目'
      }
      return this.selectedCategoryItem.name
    }
  },
  methods: {
    doNew () {
      if (this.selectedCategoryItem == null) {
        this.$notify.info({
          title: '系统提示',
          message: '未选择栏目！'
        })
        return;
      }
      this.$router.push({
        path: '/publicsubsystem/information/edit?cid=' + this.selectedCategoryItem.id
      })

    },
    doEdit (key, row) {
      let path = '/publicsubsystem/information/edit?cid=' + this.selectedCategoryItem.id + '&id=' + row.id
      this.$router.push({
        path: path
      })
    },
    handleNodeClick (dataItem, node, el) {
      this.selectedCategoryItem = dataItem
      this.gridOptions.dataSource.serviceInstanceInputParameters.classificationId = dataItem.id
      this.$refs.searchReulstList.refresh()
    },
    handleDrop (draggingNode, dropNode, dropType, ev) {
      let self = this
      tapp.services.base_InformationClassification.updateCategoryParentIdAndSortIndex({
        'id': draggingNode.data.id,
        'newParentId': dropType == 'inner' ? dropNode.data.id : dropNode.data.parentId,
        'newSortIndex': dropType == 'inner' ? 0 : (dropNode.data.self.sortIndex || 0) + (dropType == 'after' ? 1 : -1)
      }).then(function (result) {
        self.$notify.success({
          title: '栏目变更父节点成功',
          message: '系统提示'
        })

      })
    },
    handleSelectionChange (val) {
      this.selectedItems = val
    },
    doSearch () {
      this.$refs.searchReulstList.refresh()
    },
    doBatchDelete () {
      let self = this
      if (!self.selectedItems || self.selectedItems.length == 0) {
        self.$notify.info({
          title: '系统提示',
          message: '您没选择任何行，无法操作！'
        })
        return;
      }
      let ids = self.selectedItems.map(function (row) {
        return row.id
      })
      self.$confirm('确认要删除共' + ids.length + '项吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        tapp.services.base_Information.batchDelete(ids).then(function (result) {
          self.$notify.success({
            title: '系统删除成功',
            message: '系统删除成功！'
          })
          self.$refs.searchReulstList.refresh()
        })
      })
    },
    doExportExcel () {
      this.$refs.searchReulstList.exportCSV('信息公告列表')
    }
  }
}
</script>
<style >
.el-card__header {

  height: 82px;
}
</style>
