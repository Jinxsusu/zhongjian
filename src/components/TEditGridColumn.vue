<template>
<el-table-column v-bind="$attrs" v-on="$listeners" :label="label">
  <template slot-scope="scope">
    <slot  :row="scope.row">
    </slot>
</template>
</el-table-column>
</template>

<script>
import rules from 'element-ui-verify/dist/rules.js'
import errorMessage from 'element-ui-verify/dist/error-message.js'

export default {
  components: {},
  props: {
    prop: undefined,
    label: undefined,
    verify: undefined,
    canBeEmpty: undefined,
  },
  data() {
    return {
      ruleGetters: rules(),
      errorMessageManager: errorMessage,
    }
  },
  created() {

  },
  mounted() {},
  computed: {},
  mounted() {},
  methods: {
    getRules: function() {
      if (this.verify == undefined) return null;
      const prop = this.prop;
      const alias = this.label || '该输入项';
      let asyncVerifyRules = [];
      if (this.canBeEmpty == undefined) {
        asyncVerifyRules.push({
          required: true,
          message: this.errorMessageManager.macroToValue(this.errorMessageManager.get('empty'), 'alias', alias),
        });
      }
      for (let name in this.ruleGetters) {
        const ruleVal = this.$attrs[name]
        if (ruleVal !== undefined) {
          let innRule = this.ruleGetters[name](ruleVal);
          if (Array.isArray(innRule)) {
            asyncVerifyRules.push([...innRule]);
          } else {
            if (innRule.message) {
              innRule.message = this.errorMessageManager.macroToValue(innRule.message, 'alias', alias)
            }
            asyncVerifyRules.push(innRule);
          }
        }
      }
      // 自定义校验方法置后
      if (typeof this.verify === 'function') asyncVerifyRules.push({
        validator: this.verify
      })

      let s = {
        name: prop,
        alias:alias,
        rules: asyncVerifyRules
      };
      return s;
    },
  },
}
</script>
