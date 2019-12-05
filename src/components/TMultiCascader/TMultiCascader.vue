<template>
<div>
  <multi-cascader ref="cascader" :placeholder="placeholder" :options="data" v-model="currentValue" v-bind="cascaderOptions" filterable clearable :change-on-select="changeOnSelect" @change="handleChange" :disabled="disabled"></multi-cascader>
</div>
</template>
<script>
const defaultCascaderOptions = {
  props: {
    value: 'id',
    label: 'name',
    children: 'items',
  },
  data: null,
};

const defaultDataSourceOptions = {
  loadDataOnFirst: true,
  serviceInstance: null,
  serviceInstanceInputParameters: null
};
import MultiCascader from './control/index.vue'
export default {
  components: {
    MultiCascader
  },
  props: {
    placeholder: '请选择',
    value: null,
    changeOnSelect: false,
    disabled: {
      type: Boolean,
      default: false,
      required: false
    },
    options: {
      type: Object,
      default: function() {
        return {
          dataSource: {},
          cascader: {}
        };
      }
    }
  },
  data() {
    return {
      data: [],
      selectValue: null,
      cascaderOptions: Object.assign({}, defaultCascaderOptions, this.options.cascader || {}),
      dataSourceOptions: Object.assign({}, defaultDataSourceOptions, this.options.dataSource || {}),
    }
  },
  watch: {
    'options.cascader': {　　　　
      handler(newValue, oldValue) {　　　
        this.cascaderOptions = Object.assign({}, this.cascaderOptions || {}, newValue);　　　　
      },
      deep: true,
      immediate: true,
    },
    'options.dataSource': {　　　　
      handler(newValue, oldValue) {
        if (!newValue) {
          return;
        }　
        if (Array.isArray(newValue)) {
          this.dataSourceOptions = newValue;　　　
        } else {　　　　　
          this.dataSourceOptions = Object.assign({}, newValue, this.options.dataSource || {});
        }　　
        this.bindCascader();　　
      },
      deep: true,
      immediate: true,
    },
    value(value) {
      this.currentValue = value;
    }
  },
  computed: {
    currentValue: {
      // 动态计算currentValue的值
      get: function() {
        return this.selectValue;
      },
      set: function(val) {
        this.selectValue = val || [];
        this.$emit('ElFormItem', 'el.form.change', val);
        this.$emit('input', val);
      }
    },
    arrayData: {
      get: function() {
        return this.$util.treeToArray(this.data);
      },
    },
  },
  created() {
    this.currentValue = this.value;
    if (this.dataSourceOptions.loadDataOnFirst === true) {
      this.bindCascader();
    }
  },
  activated() {
    this.bindCascader();
  },
  mounted() {},
  methods: {
    bindCascader() {
      let self = this;
      this.getDataPromise().then(function(result) {
        let data = result.data;
        //Cascader的BUG。如果items长度为0，会显示一个空的面板。
        self.$util.retriveTree(data, p => {
          if (p.items && p.items.length == 0) delete p.items;
        })
        self.data = data;
      });
    },
    getDataPromise() {
      let self = this;

      if (Array.isArray(self.dataSourceOptions)) {
        return new Promise(function(resolve, reject) {
          resolve({
            data: self.dataSourceOptions || [],
          });
        });
      }
      let mDatasourceService = self.dataSourceOptions.serviceInstance;
      if (mDatasourceService == null) {
        return new Promise(function(resolve, reject) {
          resolve({
            data: [],
          });
        });
      }
      let mDatasourceRequestParameters = this.dataSourceOptions.serviceInstanceInputParameters;

      var iRequestData = {};
      if (mDatasourceRequestParameters != null) {
        if (typeof(mDatasourceRequestParameters) != "object" ||
          Array.isArray(mDatasourceRequestParameters)) {
          iRequestData = mDatasourceRequestParameters;
        } else {
          var parameters = {};
          if (mDatasourceRequestParameters) {
            for (var i in mDatasourceRequestParameters) {
              if (mDatasourceRequestParameters.hasOwnProperty(i)) { //filter,只输出man的私有属性
                var source = mDatasourceRequestParameters[i];
                if (typeof source == 'function') {
                  parameters[i] = mDatasourceRequestParameters[i]();
                } else {
                  parameters[i] = mDatasourceRequestParameters[i];
                }
              };
            }
          }

          iRequestData = { ...iRequestData,
            ...parameters
          };
        }
      }
      return new Promise(function(resolve, reject) {
        return mDatasourceService(iRequestData).then(function(result) {
          resolve({
            data: result
          });
        });
      });
    },
    handleChange(val) {
      this.$emit('change', val);
    }
  },
}
</script>
