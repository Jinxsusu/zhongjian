<template>
<div>
  <el-select :placeholder="placeholder" v-bind="$attrs" v-on="$listeners" v-model="currentValue" :disabled="disabled" :multiple="multiple" :clearable="clearable" v-if="!readOnly">
    <el-option v-for="(item, index) in innerData" :key='item.id' :label="item.name" :value="item.id"></el-option>
  </el-select>
  <div v-else class="t-readonly  t-dic-dropdown-select-readonly-div">
    <span v-for="tag in selectedViewData" :key="tag.id"> {{tag.name}}</span>
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
    multiple: {
      type: Boolean,
      required: false
    },
    clearable: {
      type: Boolean,
      required: false,
      default: true
    },
       placeholder: {
      type: String,
      required: false,
      default: '请选择'
    },
    value: {
      required: true
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
      innerData: [],
    }
  },
  watch: {
    value(value) {
      this.currentValue = value || (this.multiple ? [] : null);
    },
    dicType: {　　　　
      handler(newValue, oldValue) {　
        if (newValue && newValue.toLowerCase) {
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
    this.currentValue = this.value || (this.multiple ? [] : null);
  },
  mounted() {},
  computed: {
    currentValue: {
      // 动态计算currentValue的值
      get: function() {
        return this.selectValue || (this.multiple ? [] : null);
      },
      set: function(val) {
        //如果原值，新值都为空，无需重新赋值，防止首次进入显示必输提示
        if ((!val || val.length == 0) && (!this.selectValue || this.selectValue.length == 0)) {
          return;
        }

        this.selectValue = val || (this.multiple ? [] : null);

        this.$emit('input', this.selectValue);
        this.$emit('change', this.selectedData);
        this.$emit('blur');
        if (this.$parent.$options.componentName === 'ElFormItem') {
          this.$parent.$emit('el.form.change', this.selectValue);
        }
      }
    },
    selectedViewData: {
      get: function() {
        if (!this.currentValue) {
          return  [];
        }
        if (this.multiple) {
          let dataList = this.currentValue;
          if (!Array.isArray(this.currentValue)) {
            dataList = [this.currentValue];
          }
          return this.innerData.filter(p => dataList.includes(p.id));
        } else {
          return [this.innerData.find(p => this.currentValue == p.id)];
        }
      }
      },
      selectedData: {
        get: function() {
          if (!this.currentValue) {
            return this.multiple ? [] : null;
          }
          if (this.multiple) {
            let dataList = this.currentValue;
            if (!Array.isArray(this.currentValue)) {
              dataList = [this.currentValue];
            }
            return this.innerData.filter(p => dataList.includes(p.id));
          } else {
            return this.innerData.find(p => this.currentValue == p.id);
          }
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
