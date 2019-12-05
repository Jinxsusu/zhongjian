<template>
<div>
  <el-input ref="input" v-model="currentValue" @change="onChange" @focus="onFocus"  @blur="onBlur" :placeholder="placeholder" v-bind="$attrs" v-on="$listeners" :disabled="disabled" v-if="!readOnly">
    <template slot="prepend" v-if="$slots.prepend">
    <slot name="prepend">
    </slot>
  </template>
    <template slot="append" v-if="$slots.append">
    <slot name="append">
    </slot>
  </template>
  </el-input>
  <div v-else class="t-readonly t-input-readonly-div">
    <span class="t-input-readonly-prepend" v-if="$slots.prepend">
      <slot name="prepend">
      </slot>
    </span>
    <span class="t-input-readonly-value">{{currentValue || placeholder}}</span>
    <span class="t-input-readonly-append" v-if="$slots.append">
      <slot name="append">
      </slot>
    </span>
  </div>
</div>
</template>

<script>
export default {
  components: {},
  props: {
    value: null,
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
        this.selectValue = val;
        this.$emit('input', this.selectValue);


        if (this.$parent.$options.componentName === 'ElFormItem') {
          this.$parent.$emit('el.form.change', this.selectValue);
        }
      }
    }
  },
  mounted() {},
  methods: {
    onFocus() {
      if (this.$refs.input) {
        this.$refs.input.focus();
      }
      this.$emit('focus');
    },
    onBlur() {
      this.$emit('blur');
    },
    onChange() {
        this.$emit('change', this.selectValue);
    },
    isEmpty() {
      return this.currentValue == null || this.currentValue.length == 0;
    },
  },
}
</script>
