
<template>
<div>
  <el-row :gutter="20">
    <el-col :span="9">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>字典类别</span>
          <div style="float: right; padding: 3px 0">
            <el-button icon="el-icon-delete" type="danger" @click="doCategoryBatchDelete()">批量删除</el-button>
          </div>
        </div>
        <div class="text item">
          <t-tree ref="categoryTree" :options="categoryTreeOptons" @node-click="handleCategoryNodeClick" @node-drop="handleCategoryDrop">
          </t-tree>
        </div>
      </el-card>
    </el-col>
    <el-col :span="15" v-if="showGrid">
      <item-list :categoryId="selectedCategoryItemId" :categoryName="selectedCategoryItemName" />
    </el-col>
  </el-row>
  <category-edit-form v-if="categoryEditFormVisible" ref="categoryEditForm" @change="doCategoryRefresh"></category-edit-form>
</div>
</template>
<script>
import ItemList from './itemList'
import CategoryEditForm from './categoryEdit'
import baseView from '@/base/baseView'
export default {
  extends:baseView,
  data() {
    return {
      selectedCategoryItem: null,
      categoryEditFormVisible: false,
      showGrid:false,
      categoryTreeOptons: {
        dataSource: {
          serviceInstance: tapp.services.base_DataDictionary.getTreeDataDictionaryCategories,
          serviceInstanceInputParameters: {}
        },
        tree: {
          draggable: true,
          checkStrictly: true,
          showCheckbox: true,
          defaultCheckedKeys: [],
          renderContent: this.renderCategoryContent,
        }
      },
    }
  },
  components: {
    ItemList,
    CategoryEditForm
  },
  created() {

  },
  computed: {
    selectedCategoryItemId() {
      if (this.selectedCategoryItem == null ||
        this.selectedCategoryItem.id == null) {
        return null
      }
      return this.selectedCategoryItem.id;
    },
    selectedCategoryItemName() {
      if (this.selectedCategoryItem == null ||
        this.selectedCategoryItem.name == null) {
        return '未选择字典类别'
      }
      return this.selectedCategoryItem.name;
    },
  },
  methods: {
      renderCategoryContent(h, { node, data, store }) {
          return (
            <span class="custom-tree-node">
              <span>{node.label}</span>
              <span>
                <el-button size="mini" type="text" on-click={ () => this.doCategoryEdit(node, data) }>编辑</el-button>
                <el-button size="mini" type="text" on-click={ () => this.doCategoryAppend(data) }>增加子项</el-button>
              </span>
            </span>);
      },
        doCategoryEdit(node, data) {
          this.categoryEditFormVisible = true
          this.$nextTick(() => {
            this.$refs.categoryEditForm.edit(data.id, data.name)
          })
        },

        doCategoryAppend(data) {
          this.categoryEditFormVisible = true
          this.$nextTick(() => {
            this.$refs.categoryEditForm.new(data.id, data.name)
          })
        },
        doCategoryBatchDelete() {
          let self = this;
          let ids = self.$refs.categoryTree.getCheckedKeys();
          if (!ids || ids.length == 0) {
            self.$notify.info({
              title: '系统提示',
              message: '您没选择任何行，无法操作！'
            });
            return;
          }
          self.$confirm('确认要删除共' + ids.length + '项字典类别吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            tapp.services.base_DataDictionary.batchDeleteCategory(ids).then(function(result) {
              self.doCategoryRefresh();
              self.$notify.success({
                title: '操作成功',
                message: '系统删除成功！'
              });
            })
          });
        },

    doCategoryRefresh() {
      this.$refs.categoryTree.refresh();
    },

    handleCategoryDrop(draggingNode, dropNode, dropType, ev) {
      let self = this;
      tapp.services.base_DataDictionary.updateCategoryParentIdAndSortIndex({
        'id': draggingNode.data.id,
        'newParentId': dropType == 'inner' ? dropNode.data.id : dropNode.data.parentId,
        'newSortIndex': dropType == 'inner' ? 0 : (dropNode.data.self.sortIndex || 0) + (dropType == 'after' ? 1 : -1),
      }).then(function(result) {
        self.$notify.success({
          title: '字典类别变更父节点成功，注销后重新登陆系统后修改生效',
          message: '系统提示'
        });

      })
    },
    handleCategoryNodeClick(dataItem, node, el) { 
      if (dataItem.hasChildren) {
        this.showGrid = false;
      } else {
        this.showGrid = true;
        this.selectedCategoryItem = dataItem;
      }
    },


    doExportExcel() {
      this.$refs.searchReulstList.exportCSV('字典项列表');
    },
  }
}
</script>
<style >
.el-card__header {

  height: 82px;
}
</style>
