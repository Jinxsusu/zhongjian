<template>
<div class="mod-role">
  <el-form :inline="true" @keyup.enter.native="doSearch()" v-if="queryType=='simple'">
    <el-form-item>
      <el-input style="width:300px" prefix-icon="el-icon-search" @keyup.enter.native="doSearch()" v-model="gridOptions.dataSource.serviceInstanceInputParameters.searchKey" placeholder="编号、文本输入" clearable></el-input>
    </el-form-item>
    <el-form-item>
      <el-button @click="doSearch()" icon="el-icon-search">查询</el-button>
      <el-button type="primary" @click="doNew()" icon="el-icon-plus">新增</el-button>
      <el-button icon="el-icon-download" @click="doExportExcel()">
        <i class="fa fa-lg fa-level-down"></i>导出
      </el-button>
      <el-button type="text" icon="el-icon-arrow-down" @click="doSwitchQueryType()">高级查询</el-button>
    </el-form-item>
  </el-form>
  <el-form ref="ruleForm" @keyup.enter.native="doSearch()" label-width="140px" v-if="queryType=='advanced'">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="客户编码">
          <el-input v-model="gridOptions.dataSource.serviceInstanceInputParameters.customerCode"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="客户名称">
          <el-input v-model="gridOptions.dataSource.serviceInstanceInputParameters.customerName"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="身份证号">
          <el-input v-model="gridOptions.dataSource.serviceInstanceInputParameters.customerCardNO"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="整形输入">
          <t-int-range-input v-model="queryOfLoanTermCountRange" @change="onLoanTermCountRangeChanged"></t-int-range-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="数字输入">
          <t-number-range-input v-model="queryOfLoanMoneyAmountRange" @change="onLoanMoneyAmountRangeChanged"></t-number-range-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="金额输入">
          <t-currency-range-input v-model="queryOfOriginalLoanMoneyAmountRange" @change="onOriginalLoanMoneyAmountRangeChanged"></t-currency-range-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="金额输入-万">
          <t-currency-range-input v-model="queryOfFinanceFamilyTotalAssetRange" @change="onFinanceFamilyTotalAssetRangeChanged">
          </t-currency-range-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="百分比输入">
          <t-percent-range-input v-model="queryOfFinanceReturnMoneyLoanRateRange" @change="onFinanceReturnMoneyLoanRateRangeChanged"></t-percent-range-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="日期输入">
          <t-datetime-range-picker v-model="queryOfLoanApplyDateRange" type="date" @change="onLoanApplyDateRangeChanged"></t-datetime-range-picker>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="日期时间输入">
          <t-datetime-range-picker v-model="queryOfLoanApplySumbitDateRange" type="date" @change="onLoanApplySumbitDateRangeChanged"></t-datetime-range-picker>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="人员弹出选择">
          <base-user-select role-category="base_rolecategory_trackingpersoninfomr" v-model="gridOptions.dataSource.serviceInstanceInputParameters.trackingPersonInfoMRId" :text="gridOptions.dataSource.serviceInstanceInputParameters.trackingPersonInfoMRName" placeholder="请选择">
          </base-user-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="性别">
          <t-dic-checkbox-select dicType="public_sex" v-model="gridOptions.dataSource.serviceInstanceInputParameters.sexIds"></t-dic-checkbox-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="职务-radio">
          <t-dic-checkbox-select dicType="pl_loanenter_job" v-model="gridOptions.dataSource.serviceInstanceInputParameters.jobIds"></t-dic-checkbox-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="树形单选">
          <t-dic-multi-tree-select dicType="base_region" v-model="gridOptions.dataSource.serviceInstanceInputParameters.socialSecurityIds"></t-dic-multi-tree-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="是否可用">
          <t-switch v-model="gridOptions.dataSource.serviceInstanceInputParameters.activited"></t-switch>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-bottom:22px">
      <el-col :span="24">
        <el-button @click="doSearch()" icon="el-icon-search">查询</el-button>
        <el-button type="primary" @click="doNew()" icon="el-icon-plus">新增</el-button>
        <el-button icon="el-icon-download" @click="doExportExcel()">
          <i class="fa fa-lg fa-level-down"></i>导出
        </el-button>
        <el-button type="text" icon="el-icon-arrow-up" @click="doSwitchQueryType()">简单查询</el-button>
      </el-col>
    </el-row>
  </el-form>
  <t-grid ref="searchReulstList" :options="gridOptions">
  </t-grid>
</div>
</template>

<script>
export default {
  data() {
    return {
      queryType: 'simple',
      queryOfLoanTermCountRange: null,
      queryOfLoanMoneyAmountRange: null,
      queryOfOriginalLoanMoneyAmountRange: null,
      queryOfFinanceFamilyTotalAssetRange: null,
      queryOfFinanceReturnMoneyLoanRateRange: null,
      queryOfLoanApplyDateRange: null,
      queryOfLoanApplySumbitDateRange: null,
      gridOptions: {
        dataSource: {
          serviceInstance: tapp.services.pL_LoanEnter.getPagedList,
          serviceInstanceInputParameters: {
            searchKey: null,
            activited: true,
          }
        },
        grid: {
          mutiSelect: false,
          reduceMethod: this.getSummaries,
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
              prop: 'customerCode',
              label: '编号',
              sortable: true,
                fixed: 'left',
              width: 120
            },
            {
              prop: 'customerName',
              label: '文本输入',
              sortable: true,
                fixed: 'left',
              width: 100
            },
            {
              prop: 'customerCardNO',
              label: '身份证号',
              sortable: true,
              width: 170
            },
            {
              prop: 'loanMoneyAmount',
              label: '数字输入',
              sortable: true,
              width: 120,
              formatter: (row, column, cellValue) => {
                return this.$util.numberFormat(row.loanMoneyAmount, 2);
              }
            },
            {
              prop: 'loanTermCount',
              label: '整形输入',
              sortable: true,
              width: 100,
              formatter: (row, column, cellValue) => {
                return this.$util.intFormat(row.loanMoneyAmount);
              }
            },
            {
              prop: 'originalLoanMoneyAmount',
              label: '金额输入',
              sortable: true,
              width: 100,
              formatter: (row, column, cellValue) => {
                return this.$util.moneyFormat(row.originalLoanMoneyAmount);
              }
            },
            {
              prop: 'financeFamilyTotalAsset',
              label: '金额输入-万',
              sortable: true,
              width: 120,
              render: (h, params) => {
                var self = this;
                return h('t-highlight-view', {
                  props: {
                    value: self.$util.moneyFormat(params.row.financeFamilyTotalAsset || 0),
                  }
                })
              }
            },
            {
              prop: 'financeReturnMoneyLoanRate',
              label: '百分比输入',
              sortable: true,
              width: 120,
              formatter: (row, column, cellValue) => {
                return this.$util.percentFormat(row.financeReturnMoneyLoanRate);
              }
            },
            {
              prop: 'loanApplyDate',
              label: '日期输入',
              sortable: true,
              width: 150,
              formatter: (row, column, cellValue) => {
                return this.$util.dateFormat(row.loanApplyDate);
              }
            },
            {
              prop: 'loanApplySumbitDate',
              label: '日期时间输入',
              sortable: true,
              width: 160,
              formatter: (row, column, cellValue) => {
                return this.$util.datetimeFormat(row.loanApplySumbitDate);
              }
            },
            {
              prop: 'sexId',
              columnKey: 'sexId',
              filters: this.$util.getListDataDicFilters('public_sex'),
              label: '性别',
              sortable: true,
              width: 100,
              formatter: (row, column, cellValue) => {
                return this.$util.dataDicFormat('public_sex', row.sexId);
              }
            },
            {
              prop: 'maritalStatusIdList',
              columnKey: 'maritalStatusIdList',
              label: '婚姻状况',
              sortable: true,
              width: 150,
              formatter: (row, column, cellValue) => {
                return this.$util.dataDicsFormat('public_maritalstatus', row.maritalStatusIds);
              }
            },
            {
              prop: 'socialSecurityId',
              columnKey: 'socialSecurityId',
              label: '树形单选',
              sortable: true,
              width: 150,
              formatter: (row, column, cellValue) => {
                return this.$util.dataDicFormat('base_region', row.socialSecurityId);
              }
            },
            {
              prop: 'companyWorkTermIdList',
              columnKey: 'companyWorkTermIdList',
              label: '树形多选',
              sortable: true,
              width: 150,
              formatter: (row, column, cellValue) => {
                return this.$util.dataDicsFormat('base_region', row.companyWorkTermIds);
              }
            },
            {
              prop: 'activited',
              columnKey: 'activited',
              label: '是否可用',
              sortable: true,
              width: 110,
              formatter: (row, column, cellValue) => {
                return row.activited == null ? '' : (row.activited ? '是' : '否');
              }
            },
            {
              prop: 'trackingPersonInfoMRName',
              label: '人员',
              sortable: false,
              minWidth: 120
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

  },
  methods: {
    onLoanTermCountRangeChanged(val) {
      this.gridOptions.dataSource.serviceInstanceInputParameters.loanTermCountBegin = val[0];
      this.gridOptions.dataSource.serviceInstanceInputParameters.loanTermCountEnd = val[1];
    },
    onLoanMoneyAmountRangeChanged(val) {
      this.gridOptions.dataSource.serviceInstanceInputParameters.loanMoneyAmountBegin = val[0];
      this.gridOptions.dataSource.serviceInstanceInputParameters.loanMoneyAmountEnd = val[1];
    },
    onOriginalLoanMoneyAmountRangeChanged(val) {
      this.gridOptions.dataSource.serviceInstanceInputParameters.originalLoanMoneyAmountBegin = val[0];
      this.gridOptions.dataSource.serviceInstanceInputParameters.originalLoanMoneyAmountEnd = val[1];
    },
    onFinanceFamilyTotalAssetRangeChanged(val) {
      this.gridOptions.dataSource.serviceInstanceInputParameters.financeFamilyTotalAssetBegin = val[0];
      this.gridOptions.dataSource.serviceInstanceInputParameters.financeFamilyTotalAssetEnd = val[1];
    },
    onFinanceReturnMoneyLoanRateRangeChanged(val) {
      this.gridOptions.dataSource.serviceInstanceInputParameters.financeReturnMoneyLoanRateBegin = val[0];
      this.gridOptions.dataSource.serviceInstanceInputParameters.financeReturnMoneyLoanRateEnd = val[1];
    },
    onLoanApplyDateRangeChanged(val) {
      this.gridOptions.dataSource.serviceInstanceInputParameters.loanApplyDateBegin = val[0];
      this.gridOptions.dataSource.serviceInstanceInputParameters.loanApplyDateEnd = val[1];
    },
    onLoanApplySumbitDateRangeChanged(val) {
      this.gridOptions.dataSource.serviceInstanceInputParameters.loanApplySumbitDateBegin = val[0];
      this.gridOptions.dataSource.serviceInstanceInputParameters.loanApplySumbitDateEnd = val[1];
    },

    doNew() {
      this.$router.push({
        name: 'pl_loanapplyInput',
      });
    },
    doEdit(key, row) {
      let tpath = '/loansubsystem/task/loanEnterForm?id=' + row.id;

      this.$router.push({
        path: tpath
      });
    },
    doSwitchQueryType() {
      if (this.queryType == 'simple') {
        this.queryType = 'advanced';
      } else {
        this.queryType = 'simple';
      }
    },
    doExportExcel() {
      this.$refs.searchReulstList.exportCSV('进件列表');
    },
    doSearch() {
      this.$refs.searchReulstList.refresh();
    },
    getSummaries(param) {
      const {
        columns,
        data,
        reduces
      } = param;

      this.reduces = reduces || [];

      if (reduces == null) {
        return [];
      }
      const sums = [];
      sums[1] = '合计';
      sums[7] = this.$util.moneyFormat(reduces.sumOriginalLoanMoneyAmount) || '--';
      sums[8] = (this.$util.moneyFormat(reduces.sumFinanceFamilyTotalAsset) || '--') + '万';
      return sums;
    },

  }
}
</script>
