
<template>
<div>
  <el-tabs v-model="tabActive" @tab-click="handleTabClick" tab-position="right" class="fixed-header">
    <el-tab-pane label="客户资料" name="baseInfo">
      <el-form :model="docEntity" ref="ruleForm" @keyup.enter.native="doSave()" label-width="160px">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="切换只读">
              <el-switch v-model="readOnly"></el-switch>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col>
            <h4>基本信息</h4>
            <hr class="el-row-hr" />
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="文本输入" prop="customerName" verify :maxLength="50" class="is-required">
              <t-input v-model="docEntity.customerName" :readOnly="readOnly"></t-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="文本输入-身份证号" prop="customerCardNO" verify idcard class="is-required">
              <t-input v-model="docEntity.customerCardNO" :readOnly="readOnly"></t-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="整形输入" prop="loanTermCount" verify class="is-required">
              <t-int-input v-model="docEntity.loanTermCount" :readOnly="readOnly">
                <span slot="append">月</span>
              </t-int-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="数字输入" prop="loanMoneyAmount" verify class="is-required">
              <t-number-input v-model="docEntity.loanMoneyAmount" :readOnly="readOnly"></t-number-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="金额输入" prop="originalLoanMoneyAmount" verify class="is-required">
              <t-currency-input v-model="docEntity.originalLoanMoneyAmount" :readOnly="readOnly">
                <span slot="append">元</span>
              </t-currency-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="金额输入-万" prop="financeFamilyTotalAsset" verify class="is-required">
              <t-currency-input v-model="docEntity.financeFamilyTotalAsset" :unit-value="10000" :readOnly="readOnly">
                <span slot="append">万</span>
              </t-currency-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="百分比输入" prop="financeReturnMoneyLoanRate" verify class="is-required">
              <t-percent-input v-model="docEntity.financeReturnMoneyLoanRate" :readOnly="readOnly"></t-percent-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="日期输入" prop="loanApplyDate" verify class="is-required">
              <t-datetime-picker v-model="docEntity.loanApplyDate" type="date" :readOnly="readOnly">
              </t-datetime-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="日期时间输入" prop="loanApplySumbitDate" verify class="is-required">
              <t-datetime-picker v-model="docEntity.loanApplySumbitDate" type="datetime" :readOnly="readOnly">
              </t-datetime-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="时间输入" prop="time1" verify class="is-required">
              <t-time-picker v-model="docEntity.time1" :readOnly="readOnly">
              </t-time-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="时间输入2" prop="time2" verify class="is-required">
              <t-time-picker v-model="docEntity.time2" :is-range="true" :readOnly="readOnly">
              </t-time-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="人员弹出选择" prop="trackingPersonInfoMRId" verify :maxLength="50" class="is-required">
              <base-user-select role-category="base_rolecategory_trackingpersoninfomr" v-model="docEntity.trackingPersonInfoMRId" :text="docEntity.trackingPersonInfoMRName" placeholder="请选择" :readOnly="readOnly">
              </base-user-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col>
            <h4>字典控件</h4>
            <hr class="el-row-hr" />
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="性别-下拉-单选" prop="sexId" verify class="is-required">
              <t-dic-dropdown-select dicType="public_sex" v-model="docEntity.sexId" :readOnly="readOnly"></t-dic-dropdown-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="婚姻状况-下拉-多选" prop="maritalStatusIdList" verify class="is-required">
              <t-dic-dropdown-select dicType="public_maritalstatus" :multiple="true" v-model="docEntity.maritalStatusIdList" :readOnly="readOnly"></t-dic-dropdown-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="学历-复选" prop="educationalLevelIdList" verify class="is-required">
              <t-dic-checkbox-select dicType="public_educationallevel" v-model="docEntity.educationalLevelIdList" :readOnly="readOnly"></t-dic-checkbox-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="职务-radio" prop="jobId" verify class="is-required">
              <t-dic-radio-select dicType="pl_loanenter_job" v-model="docEntity.jobId" :readOnly="readOnly"></t-dic-radio-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">

          <el-col :span="12">
            <el-form-item label="树形单选" prop="socialSecurityId" verify class="is-required">
              <t-dic-tree-select dicType="base_region" v-model="docEntity.socialSecurityId" :readOnly="readOnly"></t-dic-tree-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="树形多选" prop="companyWorkTermIdList" verify class="is-required">
              <t-dic-multi-tree-select dicType="base_region" v-model="docEntity.companyWorkTermIdList" :readOnly="readOnly"> </t-dic-multi-tree-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="是否可用" prop="activited" verify can-be-empty class="is-required">
              <t-switch v-model="docEntity.activited" :readOnly="readOnly"></t-switch>
            </el-form-item>
          </el-col>
          <el-col :span="12">
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="备注" prop="remark" verify can-be-empty :maxLength="400">
              <t-input type="textarea" :rows="3" v-model="docEntity.remark" :readOnly="readOnly"></t-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="二维码">
              <t-qr-code :url="baiduUrl"></t-qr-code>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col>
            <h4>可编辑表格</h4>
            <hr class="el-row-hr" />
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col>
            <t-edit-grid ref="customerRelationGrid" :options="customerRelationGridOptions" :readOnly="readOnly">
              <template slot="columnDataHeader">
              <t-edit-grid-column prop="customerName" label="文本输入" verify :maxLength="50" width="100" class-name="is-required">
                <template slot-scope="scope">
                <t-input v-model="scope.row.customerName" :readOnly="readOnly"></t-input>

                            </template>
              </t-edit-grid-column>
              <t-edit-grid-column prop="customerCardNO" label="身份证号" verify idcard :maxLength="50" width="100" class-name="is-required">
                <template slot-scope="scope">
                <t-input v-model="scope.row.customerCardNO" :readOnly="readOnly"></t-input>

                            </template>
              </t-edit-grid-column>
              <t-edit-grid-column prop="loanTermCount" label="整形输入" verify width="160" class-name="is-required">
                <template slot-scope="scope">
                                 <t-int-input v-model="scope.row.loanTermCount" :readOnly="readOnly">
                <span slot="append">月</span>
              </t-int-input>
                                  </template>
              </t-edit-grid-column>

              <t-edit-grid-column prop="loanMoneyAmount" label="数字输入" verify width="200" class-name="is-required">
                <template slot-scope="scope">
                               <t-number-input v-model="scope.row.loanMoneyAmount" :readOnly="readOnly"></t-number-input>
                            </template>
              </t-edit-grid-column>
              <t-edit-grid-column prop="originalLoanMoneyAmount" label="金额输入" verify width="150" class-name="is-required">
                <template slot-scope="scope">
                                         <t-currency-input v-model="scope.row.originalLoanMoneyAmount"  :readOnly="readOnly"></t-currency-input>
                            </template>
              </t-edit-grid-column>
              <t-edit-grid-column prop="financeFamilyTotalAsset" label="金额输入-万" verify width="150" class-name="is-required">
                <template slot-scope="scope">
                                       <t-currency-input v-model="scope.row.financeFamilyTotalAsset" :unit-value="10000" :readOnly="readOnly">
  <span slot="append">万</span>
              </t-currency-input>
                            </template>
              </t-edit-grid-column>

              <t-edit-grid-column prop="financeReturnMoneyLoanRate" label="百分比输入" verify width="150" class-name="is-required">
                <template slot-scope="scope">
                                   <t-percent-input v-model="scope.row.financeReturnMoneyLoanRate" :readOnly="readOnly"></t-percent-input>

              </t-currency-input>
                            </template>
              </t-edit-grid-column>
              <t-edit-grid-column prop="loanApplyDate" label="日期输入" verify width="150" class-name="is-required">
                <template slot-scope="scope">
                             <t-datetime-picker v-model="scope.row.loanApplyDate" type="date" :readOnly="readOnly">
              </t-datetime-picker>
                            </template>
              </t-edit-grid-column>
              <t-edit-grid-column prop="loanApplySumbitDate" label="日期时间输入" verify min-width="200" class-name="is-required">
                <template slot-scope="scope">
                    <t-datetime-picker v-model="scope.row.loanApplySumbitDate" type="datetime" :readOnly="readOnly">
              </t-datetime-picker>
                            </template>
              </t-edit-grid-column>

              <t-edit-grid-column prop="trackingPersonInfoMRId" label="人员弹出选择" verify min-width="160" class-name="is-required">
                <template slot-scope="scope">
                   <base-user-select role-category="base_rolecategory_trackingpersoninfomr" v-model="scope.row.trackingPersonInfoMRId" :text="scope.row.trackingPersonInfoMRName" placeholder="请选择" :readOnly="readOnly">
              </base-user-select>
                            </template>
              </t-edit-grid-column>

              <t-edit-grid-column prop="sexId" label="性别-下拉-单选" verify min-width="160" class-name="is-required">
                <template slot-scope="scope">
                    <t-dic-dropdown-select dicType="public_sex" v-model="scope.row.sexId" :readOnly="readOnly"></t-dic-dropdown-select>
                            </template>
              </t-edit-grid-column>
              <t-edit-grid-column prop="maritalStatusIdList" label="婚姻状况-下拉-多选" verify min-width="160" class-name="is-required">
                <template slot-scope="scope">
                   <t-dic-dropdown-select dicType="public_maritalstatus" :multiple="true"  v-model="scope.row.maritalStatusIdList" :readOnly="readOnly"></t-dic-dropdown-select>
                            </template>
              </t-edit-grid-column>

              <t-edit-grid-column prop="educationalLevelIdList" label="学历-复选" verify min-width="160" class-name="is-required">
                <template slot-scope="scope">
                 <t-dic-checkbox-select dicType="public_educationallevel" class="el-checkbox-group-vertical" v-model="scope.row.educationalLevelIdList" :readOnly="readOnly"></t-dic-checkbox-select>
                            </template>
              </t-edit-grid-column>

              <t-edit-grid-column prop="jobId" label="职务-radio" verify min-width="160" class-name="is-required">
                <template slot-scope="scope">
                 <t-dic-radio-select dicType="pl_loanenter_job" class="el-radio-group-vertical" v-model="scope.row.jobId" :readOnly="readOnly"></t-dic-radio-select>
                            </template>
              </t-edit-grid-column>

              <t-edit-grid-column prop="socialSecurityId" label="树形单选" verify min-width="160" class-name="is-required">
                <template slot-scope="scope">
                 <t-dic-tree-select dicType="base_region" v-model="scope.row.socialSecurityId" :readOnly="readOnly"></t-dic-tree-select>
                            </template>
              </t-edit-grid-column>
              <t-edit-grid-column prop="companyWorkTermIdList" label="树形多选" verify min-width="160" class-name="is-required">
                <template slot-scope="scope">
                <t-dic-multi-tree-select dicType="base_region" v-model="scope.row.companyWorkTermIdList" :readOnly="readOnly"> </t-dic-multi-tree-select>
                            </template>
              </t-edit-grid-column>

              <t-edit-grid-column prop="activited" label="是否可用" verify min-width="160" class-name="is-required">
                <template slot-scope="scope">
              <t-switch   v-model="scope.row.activited" :readOnly="readOnly"></t-switch>
                            </template>
              </t-edit-grid-column>
              </template>
            </t-edit-grid>

          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col>
            <h4>扩展信息(菜单 系统->扩展字段->进件扩展信息 定义表单元素)</h4>
            <hr class="el-row-hr" />
          </el-col>
        </el-row>
        <t-extend-form ref="extendForm" v-model="extendFields" definition-id="pl_loan_doc_enter" :readOnly="readOnly"></t-extend-form>

      </el-form>
    </el-tab-pane>
    <el-tab-pane label="附件" name="assetManagement">
      <div style="margin-bottom:20px;">
        <base-asset-multi-management ref="assetManagement" :assetCategoryClassifications="assetCategoryClassifications" :businessDocId="docId" v-if="tabActive =='assetManagement'">
        </base-asset-multi-management>
      </div>
    </el-tab-pane>
  </el-tabs>
 <el-row style="margin-top:20px">
          <el-col :span="24">
            <div v-if="formResult == 0" class="t-form-footer">
      <div style="float:left">
        <base-export-template :templateUrl="exportTemplateUrl" :templateCategoryId="'base_exporttemplate_pl_contract'" :title="'打印'" :docId="docId"></base-export-template>
      </div>
      <div style="float:right">
        <el-button type="primary" @click="doSave()">保存</el-button>
        <el-button type="danger" v-if="formAction == 1" @click="doDelete()">删除</el-button>
      </div>
	   </div>
    </el-col>
  </el-row>
</div>
</template>

<script>
import moment from 'moment';
import baseView from '@/base/baseView'
export default {
  extends: baseView,
  data() {
    return {
      readOnly: false,
      tabActive: 'baseInfo',
      docId: null,
      docEntity: {},
      customerRelationGridOptions: {
        dataSource: [],
        grid: {
          defaultSort: {
            prop: 'id',
            order: 'ascending'
          },
        },
      },
      baiduUrl: 'http://wwww.baidu.com',
      extendFields: {},
      assetCategoryClassifications: ['pl_loanapplyInput'],
      formAction: 0, // 0：add,1:edit
      exportTemplateUrl: null,
    }
  },
  components: {},
  created() {

  },
  activated() {
    this.$nextTick((_)=>{
      if (this.routeChanged) {
        this.load();
      }
    });
  },
  computed: {},
  methods: {
    handleTabClick(tab, event) {
      if (!tab) {
        return;
      }
      this.tabActive = tab.name;
    },
    load() {
      this.docId = this.$route.query.id;
      this.$util.ui.title(this.title);

      this.exportTemplateUrl = window.SITE_CONFIG['serverUrl'] + '/authapi/pl_loanenter/export?loanDocId=' + this.docId;
      let self = this;
      if (self.docId) {
        tapp.services.pL_LoanEnter.get(self.docId).then(function(result) {
          self.$refs.ruleForm.resetFields();
          self.docEntity = result;
          if (!self.docEntity.loanApplyDate) {
            self.docEntity.loanApplyDate = self.$util.datetimeFormat(moment());
          }
          self.customerRelationGridOptions.dataSource = result.customerRelations;
          self.extendFields = result.extendFields;

          delete self.docEntity.customerRelations;
          delete self.docEntity.extendFields;

          self.formAction = 1;
          self.clearValidate();
        });
      } else {
        tapp.services.base_Common.getSUIds(1).then(function(result) {
          //data恢复初始化数据
           self.resetData();
          self.docId = result[0];
          self.docEntity = {
            id: self.docId,
            loanApplyDate: self.$util.datetimeFormat(moment()),
          };
          self.customerRelationGridOptions.dataSource = [];
          self.formAction = 0;
          self.clearValidate();
        });
      }

    },
    clearValidate() {
      this.$nextTick((_) => {
        this.$refs.customerRelationGrid.clearValidate();
        this.$refs.ruleForm.clearValidate();
        this.$refs.extendForm.clearValidate();
      });
    },
    doSave() {
      let self = this;
      let selfValidPromise = self.$refs['ruleForm'].validate();
      let customerRelationGridValidPromise = this.$refs.customerRelationGrid.validate();
      let extendFormValidPromise = this.$refs.extendForm.validate();

      Promise.all([selfValidPromise, customerRelationGridValidPromise, extendFormValidPromise])
        .then(resultList => {

          let customerRelationData = self.$refs.customerRelationGrid.getData();

          let model = { ...self.docEntity
          };
          model.customerRelations = customerRelationData.list;
          model.customerRelationDeleteIdList = customerRelationData.deletedIdList;
          model.extendFields = self.extendFields;

          tapp.services.pL_LoanEnter.save(model).then(function(result) {
            self.docEntity = Object.assign({}, self.docEntity, result);
            self.formAction = 1;
            self.$notify.success({
              title: '操作成功！',
              message: '保存成功！',
            });
          });
        }).catch(function(e) {
          self.$notify.error({
            title: '错误',
            message: '系统输入验证失败！'
          });
          return false;
        });
    },
    doDelete() {
      let self = this;
      self.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {

        tapp.services.pL_LoanEnter.delete(self.docId).then(function(result) {

          self.$util.closeCurrentTabNav('pl_loanapplyInputList');
          self.$notify.success({
            title: '系统成功',
            message: '删除成功！'
          });

        })
      });
    },
  }
}
</script>
