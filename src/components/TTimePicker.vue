<template>
<div>
  <el-time-picker :is-range="isRange" v-model="currentValue" align="right" :value-format="valueFormat" :picker-options="pickerOptions" :disabled="disabled" v-if="!readOnly">
  </el-time-picker>
  <div v-else class="t-readonly  t-time-picker-readonly-div">
    <span>{{displayValue}}</span>
  </div>
</div>
</template>
<script>
import moment from 'moment';
import util from '@/util'
export default {
  components: {},
  props: {
    value: null,
    pickerOptions: {
      type: Object,
      default: () => {

      },
      required: false
    },
    isRange: {
      type: Boolean,
      default: false,
      required: false
    },
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
      selectValue: null,
    }
  },
  watch: {
    value(value) {
      if (value) {
        this.currentValue = value;
      } else {
        this.currentValue = null;
      }
    }
  },
  created() {
    if (this.value) {
      this.currentValue = this.value;
    } else {
      this.currentValue = null;
    }
  },
  mounted() {},
  computed: {
    valueFormat: {
      get: function() {
        let datefromPattern = 'HH:mm:ss';
        return datefromPattern;
      },
    },
    displayValue() {
      if (!this.currentValue) {
        return '';
      }
      if (this.isRange && Array.isArray(this.currentValue)) {
        let values = this.currentValue.map(p => {
          return util.datePatternFormat(p, this.valueFormat);
        })
        return values.join('~');
      } else {
        return this.currentValue;
      }
    },
    currentValue: {
      // 动态计算currentValue的值
      get: function() {
        if (this.isRange) {
          if (!this.selectValue) {
            return [];
          } else {
            return this.selectValue.split('~');
          }
        } else {
          return this.selectValue;
        }
      },
      set: function(val) {
        //如果原值，新值都为空，无需重新赋值，防止首次进入显示必输提示
        if ((val == null || val == undefined) && (this.selectValue == null || this.selectValue == undefined)) {
          return;
        }

        let v = null;
        if (val && this.isRange && Array.isArray(val)) {
          let values = val.map(p => {
            return util.datePatternFormat(p, this.valueFormat);
          })
          v = values.join('~');
        } else {
          v = val;
        }
        this.selectValue = v;
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
