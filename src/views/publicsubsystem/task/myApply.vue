<template>
<div class="mod-role">
  <el-form :inline="true" @keyup.enter.native="doSearch()">
    <el-form-item>
      <el-input v-model="gridOptions.dataSource.serviceInstanceInputParameters.searchKey" placeholder="流程名称" clearable></el-input>
    </el-form-item>
    <el-form-item>
      <el-button icon="el-icon-search" @click="doSearch()">查询</el-button>
      <el-button icon="el-icon-download" @click="doExportExcel()">导出</el-button>
    </el-form-item>
  </el-form>
  <t-grid ref="searchReulstList" :options="gridOptions">
  </t-grid>
</div>
</template>

<script>
import baseView from '@/base/baseView'
export default {
  extends: baseView,
  data() {
    return {
      gridOptions: {
        dataSource: {
          serviceInstance: tapp.services.wF_ProcessDef.getMyApplyPagedList,
          serviceInstanceInputParameters: {
            searchKey: null,
          }
        },
        grid: {
          columns: [{
            prop: 'name',
            label: '流程名称',
            sortable: true,
            minWidth: 150,
            render: (h, params) => {
                          var self = this;
                          return (<div style="margin:0 auto; ">
                                    <a href='#'  onClick={()=> this.doEdit(params.row)}>
                                    {params.row.name}</a>
                                  </div>);
                        }
          }, ], // 需要展示的列
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

  },
  methods: {
    doEdit(row) {
      let path = row.procInstStartUrl;
        //查看详情
        this.$router.push({
          path
        });
      return;
    },
    doExportExcel() {
      this.$refs.searchReulstList.exportCSV('申请列表');
    },
    doSearch() {
      this.$refs.searchReulstList.refresh();
    }
  }
}
</script>
