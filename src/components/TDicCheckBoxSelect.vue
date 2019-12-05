
<template>
<div>
  <el-checkbox-group v-model="currentValue"  value-key="id"  v-if="!readOnly">
    <el-checkbox v-for="item in innerData" :key="item.id" :label="item.id" :disabled="disabled">{{item.name}}</el-checkbox>
  </el-checkbox-group>
  <div v-else class="t-readonly  t-dic-checkbox-select-readonly-div">
    <span v-for="tag in selectedData" :key="tag.id"> {{tag.name}}</span>
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
    value: {
      type: Array,
      default: () => [],
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
      selectValue: [],
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
        if (!this.selectValue) {
          return [];
        }
        return this.selectValue;
      },
      set: function(val) {
        if ((!val || val.length == 0) && (!this.selectValue || this.selectValue.length == 0)) {
          return;
        }
        this.selectValue = val || [];
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
          return [];
        }
        return this.innerData.filter(p => this.currentValue.includes(p.id));
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
