<template>
<div>
  <el-date-picker :type="type" v-model="currentValue" align="right" :picker-options="pickerOptions" :value-format="valueFormat" :disabled="disabled"  v-if="!readOnly">
  </el-date-picker>
  <div v-else class="t-readonly  t-datetime-picker-readonly-div">
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
    disabled: {
      type: Boolean,
      default: false,
      required: false
    },
    type: {
      type: String,
      default: 'datetime'
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
      pickerOptions: {},
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
    if (this.type == 'datetime' || this.type == 'date') {
      this.pickerOptions = {
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            const date = util.datetimeFormat(moment());
            picker.$emit('pick', date);
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const date = util.datetimeFormat(moment().startOf('day').subtract(1, 'days'));
            picker.$emit('pick', date);
          }
        }, {
          text: '周一',
          onClick(picker) {
            const date = util.datetimeFormat(moment().startOf('isoWeek'));
            picker.$emit('pick', date);
          }
        }, {
          text: '月初',
          onClick(picker) {
            const date = util.datetimeFormat(moment().startOf('month'));
            picker.$emit('pick', date);
          }
        }, {
          text: '年初',
          onClick(picker) {
            const date = util.datetimeFormat(moment().startOf('year'));
            picker.$emit('pick', date);
          }
        }]
      }
    }
  },
  mounted() {},
  computed: {
    valueFormat: {
      get: function() {
        if (this.type == 'datetime' || this.type == 'date') {
          let datefromPattern = 'yyyy-MM-dd HH:mm:ss';
          return datefromPattern;
        }
        return null;
      },
    },
    displayValue() {
      if (!this.currentValue) {
        return '';
      }
      if (this.type == 'datetime' || this.type == 'date') {
        let format = this.type == 'datetime' ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD';
        let r = util.datePatternFormat(this.currentValue, format);
        return r;
      } else if (this.type == 'datetimerange' || this.type == 'daterange') {
        if (Array.isArray(this.currentValue)) {
          let format = this.type == 'datetimerange' ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD';
          let values = this.currentValue.map(p => {
            return util.datePatternFormat(p, format);
          })
          return values.join('~');
        }
      } else {
        return this.currentValue;
      }
    },
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
