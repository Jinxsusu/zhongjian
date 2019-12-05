<template>
<t-cascader :options="controlOptions" v-model="currentValue"  :disabled="disabled" size="small"></t-cascader>
</template>
<script>
export default {
  components: {},
  props: {
    placeholder: '请选择',
    value: null,
    disabled: {
      type: Boolean,
      default: false,
      required: false
    },
  },
  data() {
    return {
      controlOptions: {
        dataSource: [],
        cascader: {
          changeOnSelect: false,
        },
      },
      selectValue: null,
    }
  },
  watch: {
    value(value) {
      this.currentValue = value;
    }
  },
  created() {
    let dicRoot = tapp.data.base_datadictionary_category;
    if (dicRoot != null) {
      this.controlOptions.dataSource = dicRoot;
    }

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
    }
  },
  mounted() {},
  methods: {
    isEmpty() {
      return this.currentValue == null || this.currentValue.length == 0;
    },

  },
}
</script>
Cascader
