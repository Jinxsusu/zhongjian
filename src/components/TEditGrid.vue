<template>
<div>
  <el-row :gutter="20" v-if="!disabled && !readOnly">
    <el-col>
      <el-button type="primary" icon="el-icon-plus" circle size="mini" @click="doNew()"></el-button>
      <el-button type="danger" icon="el-icon-delete" circle size="mini" @click="doBatchDelete()" :disabled="selectedItems.length <= 0"></el-button>
      <el-button type="warning" icon="el-icon-warning" circle size="mini" @click="validate()" v-show="false"></el-button>
    </el-col>
  </el-row>
  <el-row :gutter="20">
    <el-col>
      <t-grid ref="editGridList" :options="gridOptions" @selection-change="handleSelectionChange" :disabled="disabled"> 
        <template slot="columnDataHeader">
      <slot name="columnDataHeader">
      </slot>
    </template>
      </t-grid>
    </el-col>
  </el-row>
</div>
</template>

<script>
import TGrid from './TGrid.vue'
import AsyncValidator from 'async-validator'
const defaultGridOptions = {
  pageable: false,
  mutiSelect: true, // 是否支持列表项选中功能
  showOverflowTooltip: true,
  customColumnDataHeader: true,
  editable: true,
};

export default {
  components: {
    TGrid
  },
  props: {
    disabled: {
      type: Boolean,
      default: false,
      required: false
    },
    readOnly: {
      type: Boolean,
      default: false,
      required: false
    },
    rowDefaultValue: {
      type: Object,
      default: function() {
        return {}
      }
    }, //行默然值对象
    defaultRowsCount: {
      type: Number,
      default: 1
    },
    options: {
      dataSource: [],
      grid: {},

    } // table 表格的控制参数
  },
  data() {
    return {
      gridOptions: {
        dataSource: [],
        grid: Object.assign({}, defaultGridOptions, this.options.grid),
      },
      innerData: [],
      selectedItems: [],
      rowRule: null, //行验证规则,规则参考：async-validator
      rowFieldAliasMap: null,
      ruleFieldToAliasReg: new RegExp(`(该输入项|该项)`, 'g'),
    }
  },
  watch: {
    'options.grid': {　　　　
      handler(newValue, oldValue) {　
        this.gridOptions.grid = Object.assign({}, this.gridOptions.grid, newValue || {});
      },
      deep: true,
    },
    'options.dataSource': {　　　　
      handler(newValue, oldValue) {　
        this.resolveDataSource(newValue);　
      },
      deep: true,
      immediate: true,
      　
    },
    innerData: {　　　　
      handler(newValue, oldValue) {
        let availinnerData = newValue.filter(function(item) {
          return item.entity != null
        }).map(function(item, index) {
          return item.entity;
        });
        this.gridOptions.dataSource = availinnerData;　　　　
      },
      deep: true,
      immediate: true,
    }
  },
  created() {},
  mounted() {},
  computed: {},
  methods: {
    buildRowRuleAndFieldAliasMap() {
      this.rowRule = {};
      this.rowFieldAliasMap = new Map();
      let columnCtls = this.$refs.editGridList.$children[0].$children[0].$children;

      columnCtls.forEach(el => {
        if (el && el.prop) {
          this.rowFieldAliasMap.set(el.prop, el.label);
        }
        if (el.getRules) {
          let rule = el.getRules();
          if (rule && rule.name && rule.rules && rule.rules.length > 0) {
            this.rowRule[rule.name] = rule.rules;
          }

        }
      })
    },
    validate() {
      this.buildRowRuleAndFieldAliasMap();
      let isValid = true;
      this.innerData.forEach((item, index) => {
        let entity = item.entity;
        if (entity == null) {
          return;
        }
        this.validateRow(entity);

        //直接修改数组对象的值无法触发UI更新，手工更新
        //注意，动态增加的对象属性，也无法触发UI更新
        this.innerData.splice(index, 1, item);
      });
      return this.innerData.filter(p => p.entity != null && p.entity.hasError != null && p.entity.hasError === true).length == 0;
    },
    getData() {
      let availinnerData = this.innerData.filter(p => p.entity != null).map(p => {
        let innerEntity = p.entity;
        if (innerEntity.entityStatus == 0) {
          innerEntity.id = null;
        }
        return innerEntity;
      });
      let availinnerDataIdList = this.innerData.filter(p => p.entity == null && p.id != null).map(p => p.id);

      let data = {
        "list": availinnerData,
        "deletedIdList": availinnerDataIdList,
      };

      return data;
    },
    resolveDataSource(dataSource) {
      this.innerData = [];
      if (!dataSource) {
        dataSource = [];
      }
      let defaultRowsCount = this.defaultRowsCount;
      if (dataSource.length == 0 && defaultRowsCount > 0) {
        for (let i = 0; i < defaultRowsCount; i++) {
          this.doNew();
        }
      }
      if (dataSource) {
        dataSource.forEach((item, index) => {
          let innneritem = { ...item
          };
          innneritem.entityStatus = 1;
          innneritem.hasError = false;
          innneritem.errorMessage = null;
          let newItem = {
            id: item.id,
            entity: innneritem
          };
          this.innerData.push(newItem);
        });
      }
    },
    handleSelectionChange(val) {
      this.selectedItems = val;
    },
    doNew() {
      let tempId = this.innerData.length;
      let entity = Object.assign({}, this.rowDefaultValue || {}, {
        id: tempId,
        hasError: false,
        errorMessage: null,
        entityStatus: 0,
      });
      this.innerData.push({
        id: tempId,
        entity: entity
      });
    },
    doBatchDelete() {
      let self = this;
      if (!self.selectedItems || self.selectedItems.length == 0) {
        self.$notify.info({
          title: '系统提示',
          message: '您没选择任何行，无法操作！'
        });
        return;
      }
      let ids = self.selectedItems.map(function(row) {
        return row.id;
      });
      ids.forEach((item, index) => {
        let itemIndex = self.innerData.findIndex((innerItem) => {
          return innerItem.id == item;
        });
        let innerDataEntity = self.innerData[itemIndex];
        if (innerDataEntity.entity.entityStatus == 0) {
          self.innerData.splice(itemIndex, 1);
        } else {
          innerDataEntity.entity = null
        }
      })
    },
    validateRow(innerEntity) {
      let rules = this.rowRule;
      const ruleFieldToAlreg = new RegExp(`该输入项`, 'g')
      if (rules != null) {
        var validator = new AsyncValidator(rules)
        validator.validate(innerEntity, {
          firstFields: true
        }, (errors, fields) => {
          if (errors != null && errors.length > 0) {
            innerEntity.hasError = true;
            innerEntity.errorMessage = errors.map(p => {
              let message = p.message;
              let alias = this.rowFieldAliasMap.get(p.field);
              if (message && alias) {
                message = message.replace(this.ruleFieldToAliasReg, alias);
              }
              return message;
            }).join(",");
            return false;
          } else {
            innerEntity.hasError = false;
            innerEntity.errorMessage = null;
            return true;
          }
        })
      } else {
        innerEntity.hasError = false;
        innerEntity.errorMessage = null;
        return true;
      }
    },
    clearValidate() {
      this.innerData.forEach((item, index) => {
        let entity = item.entity;
        if (entity == null) {
          return;
        }
        entity.hasError = false;
        entity.errorMessage = null;
      });
    },
  },
}
</script>
