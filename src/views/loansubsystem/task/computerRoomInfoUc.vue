
<template>
<el-form :model="headerEntity" ref="ruleForm" label-width="160px">
  <el-row :gutter="20">
    <el-col :span="12">
      <el-form-item label="申请部门" prop="requesterDeptId" verify class="is-required" :maxLength="50">
        <t-input v-model="headerEntity.requesterDeptName" :readOnly="readOnly"></t-input>
      </el-form-item>
    </el-col>
    <el-col :span="12">
      <el-form-item label="申请人" prop="requesterId" verify class="is-required" :maxLength="50">
        <t-input v-model="headerEntity.requesterName" :readOnly="readOnly"></t-input>
      </el-form-item>
    </el-col>
  </el-row>
  <el-row :gutter="20">
    <el-col :span="12">
      <el-form-item label="申请人电话" prop="requesterMobile" verify class="is-required" :maxLength="50">
        <t-input v-model="headerEntity.requesterMobile" :readOnly="readOnly"></t-input>
      </el-form-item>
    </el-col>
    <el-col :span="12">
      <el-form-item label="申请时间" prop="requestDate" verify class="is-required">
        <t-datetime-picker v-model="headerEntity.requestDate" type="date" :readOnly="readOnly"></t-datetime-picker>
      </el-form-item>
    </el-col>
  </el-row>
  <el-row :gutter="20">
    <el-col :span="12">
      <el-form-item label="系统名称" prop="systemName" verify class="is-required" :maxLength="50">
        <t-input v-model="headerEntity.systemName" :readOnly="readOnly"></t-input>
      </el-form-item>
    </el-col>
    <el-col :span="12">
      <el-form-item label="IP地址" prop="equipmentIp" verify class="is-required" :maxLength="50">
        <t-input v-model="headerEntity.equipmentIp" :readOnly="readOnly"></t-input>
      </el-form-item>
    </el-col>
  </el-row>
  <el-row :gutter="20">
    <el-col :span="12">
      <el-form-item label="设备名称" prop="equipmentName" verify class="is-required" :maxLength="50">
        <t-input v-model="headerEntity.equipmentName" :readOnly="readOnly"></t-input>
      </el-form-item>
    </el-col>
    <el-col :span="12">
      <el-form-item label="设备型号" prop="equipmentModel" verify class="is-required" :maxLength="50">
        <t-input v-model="headerEntity.equipmentModel" :readOnly="readOnly"></t-input>
      </el-form-item>
    </el-col>
  </el-row>
  <el-row :gutter="20">
    <el-col :span="12">
      <el-form-item label="机柜号（或操作地点）" prop="equipmentAddress" verify class="is-required" :maxLength="50">
        <t-input v-model="headerEntity.equipmentAddress" :readOnly="readOnly"></t-input>
      </el-form-item>
    </el-col>
    <el-col :span="12">
      <el-form-item label="设备责任人" prop="equipmentResponsibleMr" verify class="is-required" :maxLength="50">
        <t-input v-model="headerEntity.equipmentResponsibleMr" :readOnly="readOnly"></t-input>
      </el-form-item>
    </el-col>
  </el-row>
  <el-row :gutter="20">
    <el-col :span="24">
      <el-form-item label="具体维护操作步骤描述" prop="operationStepDesc" verify class="is-required" :maxLength="400">
        <t-input v-model="headerEntity.operationStepDesc" type="textarea" :rows="3" :readOnly="readOnly"></t-input>
      </el-form-item>
    </el-col>
  </el-row>
  <el-row :gutter="20">
    <el-col :span="24">
      <el-form-item label="影响范围" prop="effectScopeDesc" verify class="is-required" :maxLength="400">
        <t-input v-model="headerEntity.effectScopeDesc" type="textarea" :rows="3" :readOnly="readOnly"></t-input>
      </el-form-item>
    </el-col>
  </el-row>
  <el-row :gutter="20">
    <el-col :span="24">
      <el-form-item label="达到目的" prop="targetDesc" verify class="is-required" :maxLength="400">
        <t-input v-model="headerEntity.targetDesc" type="textarea" :rows="3" :readOnly="readOnly"></t-input>
      </el-form-item>
    </el-col>
  </el-row>
  <el-row :gutter="20">
    <el-col :span="12">
      <el-form-item label="维护开始时间" prop="maintainStartTime" verify class="is-required">
        <t-datetime-picker v-model="headerEntity.maintainStartTime" type="date" :readOnly="readOnly"></t-datetime-picker>
      </el-form-item>
    </el-col>
    <el-col :span="12">
      <el-form-item label="维护结束时间" prop="maintainEndTime" verify class="is-required">
        <t-datetime-picker v-model="headerEntity.maintainEndTime" type="date" :readOnly="readOnly"></t-datetime-picker>
      </el-form-item>
    </el-col>
  </el-row>
  <el-row :gutter="20">
    <el-col :span="24">
      <el-form-item label="备注" prop="maintainRemark" verify can-be-empty :maxLength="400">
        <t-input v-model="headerEntity.maintainRemark" :readOnly="readOnly"></t-input>
      </el-form-item>
    </el-col>
  </el-row>
  <el-row :gutter="20">
    <el-col :span="24">
      <el-form-item label="维护结果描述" prop="maintainResultRemark" verify can-be-empty :maxLength="400">
        <t-input v-model="headerEntity.maintainResultRemark" type="textarea" :rows="3" :readOnly="readOnly"></t-input>
      </el-form-item>
    </el-col>
  </el-row>
  <el-row :gutter="20">
    <el-col :span="12">
      <el-form-item label="部门经理" prop="deptMr" verify :maxLength="50" class="is-required">
        <base-user-select role-category-id="base_rolecategory_trackingpersoninfomr" v-model="headerEntity.deptMr" :text="headerEntity.deptMrName" placeholder="请选择" :readOnly="readOnly" @change="onDeptMrChanged">
        </base-user-select>
      </el-form-item>
    </el-col>
  </el-row>
  </el-form-item>
  <el-row :gutter="20">
    <el-col>
      <h4>维护人员</h4>
      <hr class="el-row-hr" />
    </el-col>
  </el-row>
  <el-row :gutter="20">
    <el-col>
      <t-edit-grid ref="maintainInfoListGrid" :options="maintainInfoListGridOptions" :readOnly="readOnly">
        <template slot="columnDataHeader">
        <el-table-column width="50">
          <template slot-scope="scope">
               <el-tooltip class="item" effect="dark" :content="scope.row.errorMessage" placement="top-start" v-if="scope.row.hasError">
                 <el-button type="danger" icon="el-icon-error" circle size="mini" style="padding:4px" :readOnly="readOnly"></el-button>
               </el-tooltip>
             </template>
        </el-table-column>
        <t-edit-grid-column label="姓名" width="180" prop="name" verify class="is-required" :maxLength="50">
          <template slot-scope="scope">
                            <t-input v-model="scope.row.name" :readOnly="readOnly"></t-input>

                      </template>
        </t-edit-grid-column>
        <t-edit-grid-column label="工作单位" width="180" prop="companyName" verify class="is-required" :maxLength="50">
          <template slot-scope="scope">
                            <t-input v-model="scope.row.companyName" :readOnly="readOnly"></t-input>

                      </template>
        </t-edit-grid-column>
        <t-edit-grid-column label="联系方式" width="180" prop="linkMode" verify class="is-required" :maxLength="50">
          <template slot-scope="scope">
                            <t-input v-model="scope.row.linkMode" :readOnly="readOnly"></t-input>

                      </template>
        </t-edit-grid-column>
        <t-edit-grid-column label="备注" minWidth="180" prop="remark" verify can-be-empty :maxLength="50">
          <template slot-scope="scope">
                            <t-input v-model="scope.row.remark" :readOnly="readOnly"></t-input>

                      </template>
        </t-edit-grid-column>
        </template>
      </t-edit-grid>
    </el-col>
  </el-row>
</el-form>
</template>

<script>
export default {
  props: {
    readOnly: {
      type: Boolean,
      default: false,
      required: false
    },
    value: {
      type: Object,
      default: function() {
        return {
          headerEntity: {},
          maintainInfoList: []
        };
      }
    }
  },
  data() {
    return {
      headerEntity: {},
      maintainInfoListGridOptions: {
        dataSource: [],
        grid: {
          mutiSelect: false,
          defaultSort: {
            prop: 'id',
            order: 'ascending'
          },
        },
        rowDefaultValue: { //行默然值对象
        },
      },
    }
  },
  watch: {
    'value': {　　　　
      handler(newValue, oldValue) {　
        if (!newValue) {
          this.headerEntity = {};
          this.maintainInfoListGridOptions.dataSource = [];
        } else {
          this.headerEntity = newValue.headerEntity || {};
          this.maintainInfoListGridOptions.dataSource = newValue.maintainInfoList || [];
        }
      },
      deep: true,
      immediate: true,
    },
  },
  components: {},
  created() {},
  computed: {},
  methods: {
    onDeptMrChanged(val) {
      this.headerEntity.deptMrName = val.name;
    },
    validate() {
      let validPromises = [this.$refs['ruleForm'].validate()];
      validPromises.push(Promise.resolve(this.$refs.maintainInfoListGrid.validate()));

      return validPromises;
    },
    clearValidate() {
      this.$nextTick((_) => {
        this.$refs.maintainInfoListGrid.clearValidate();
        this.$refs.ruleForm.clearValidate();
      });
    },
    getData() {
      let maintainInfoListData = this.$refs.maintainInfoListGrid.getData();
      let data = {
        'headerEntity': this.headerEntity,
        'maintainInfoList': maintainInfoListData
      };
      return data;
    },
  }
}
</script>
