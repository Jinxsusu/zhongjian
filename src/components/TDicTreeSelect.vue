<template>
<div>
  <div v-if="!readOnly">
    <t-cascader :options="controlOptions" v-model="currentValue"  :change-on-select="changeOnSelect" :disabled="disabled" size="small"></t-cascader>
  </div>
  <div v-else class="t-readonly  t-dic-tree-select-readonly-div">
    <span> {{!selectedData||!selectedData.path ?'':selectedData.path.replace('.;', '').replace(';', '/')}}</span>
  </div>
</div>
</template>
<script>
export default {
  components: {},
  props: {
    dicType: {
      type: String,
      required: false
    },
    data: {
      type: Array,
      default: null,
      required: false
    },
    changeOnSelect: false,
       placeholder: {
      type: String,
      required: false,
      default: '请选择'
    },
    value: null,
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
  },
  data() {
    return {
      controlOptions: {
        dataSource: [],
        cascader: {},
      },
      selectValue: null,
    }
  },
  watch: {
    value(value) {
      this.currentValue = value;
    },
    dicType: {　　　　
      handler(newValue, oldValue) {　
        if (newValue) {
          this.controlOptions.dataSource = tapp.data.base_datadictionary[newValue.toLowerCase()];
        }
      },
      immediate: true,
    },
    data: {　　　　
      handler(newValue, oldValue) {　
        if (newValue) {
          this.controlOptions.dataSource = newValue;
        }
      },
      immediate: true,
    },
  },
  created() {
    this.currentValue = this.value;
  },
  mounted() {},
  computed: {
    currentValue: {
      // 动态计算currentValue的值
      get: function() {
        return this.selectValue;
      },
      set: function(val) {
        //如果原值，新值都为空，无需重新赋值，防止首次进入显示必输提示
                if ( (val ==null || val == undefined) && (this.selectValue == null || this.selectValue == undefined)) {
          return;
        }
        this.selectValue = val;
        this.$emit('input', this.selectValue);
        this.$emit('change', this.selectValue);
        this.$emit('blur');
        if (this.$parent.$options.componentName === 'ElFormItem') {
          this.$parent.$emit('el.form.change', this.selectValue);
        }
      }
    },
    arrayData: {
      get: function() {
        return this.$util.treeToArray(this.controlOptions.dataSource);
      },
    },
    selectedData: {
      get: function() {

        if (!this.currentValue) {
          return null;
        }
        let selectedItem = this.arrayData.find(p => p && this.currentValue === p.id);

        return selectedItem;
      },
    },
  },
  mounted() {},
  methods: {
    isEmpty() {
      return this.currentValue == null || this.currentValue.length == 0;
    },
  },
}
</script>
