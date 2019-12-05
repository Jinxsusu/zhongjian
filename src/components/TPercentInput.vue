<template>
<number-input ref="input" :placeholder="placeholder" v-bind="$attrs" v-on="$listeners" v-model="currentValue" currency="%" currency-symbol-position="suffix" :disabled="disabled" :readOnly="readOnly">
  <template slot="prepend" v-if="$slots.prepend">
    <slot name="prepend">
    </slot>
  </template>
  <template slot="append" v-if="$slots.append">
    <slot name="append">
    </slot>
  </template>
</number-input>
</template>

<script>
import NumberInput from './TNumberInput.vue'
export default {
  components: {
    NumberInput
  },
  props: {
    placeholder: {
      type: String,
      default: '',
      required: false
    },
    disabled: {
      type: Boolean,
      default: false,
      required: false
    },
    value: null,
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
      this.currentValue = value;
    }
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

        if (val != null || val != undefined) {
          this.selectValue = val.toString();
        } else {
          this.selectValue = null;
        }
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
