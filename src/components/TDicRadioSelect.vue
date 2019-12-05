<template>
<div>
  <el-radio-group v-model="currentValue"  value-key="id" :disabled="disabled" v-if="!readOnly">
    <el-radio v-for="(item, index) in innerData" :key='item.id' :label="item.id" :value="item.id">{{item.name}}</el-radio>
  </el-radio-group>
  <div v-else class="t-readonly  t-dic-radio-select-readonly-div">
    <span>  {{selectedData?selectedData.name:''}}</span>
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
      selectValue: null,
      innerData: [],
    }
  },
  watch: {
    value(value) {
      this.currentValue = value;
    },
    dicType: {　　　　
      handler(newValue, oldValue) {　
        if (newValue) {
          this.innerData = tapp.data.base_datadictionary[newValue.toLowerCase()];
        }
      },
      immediate: true,
    },
    data: {　　　　
      handler(newValue, oldValue) {　
        if (newValue) {
          this.innerData = newValue.map(p => {
            return {
              id: p.value,
              name: p.label || p.value,
            };
          });
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
    selectedData: {
      get: function() {
        if (!this.currentValue) {
          return '';
        }
        return this.innerData.find(p => this.currentValue == p.id);
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
