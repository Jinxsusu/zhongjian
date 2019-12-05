<template>
<div>

  <el-form ref="generateForm" :model="models" :rules="rules" :label-position="data.config.labelPosition" :label-width="data.config.labelWidth + 'px'" :disabled="disabled">
    <template v-for="item in data.list">

        <template v-if="item.type == 'grid'">
          <el-row
            :key="item.key"
            type="flex"
            :gutter="item.options.gutter ? item.options.gutter : 0"
            :justify="item.options.justify"
            :align="item.options.align"
          >
            <el-col v-for="(col, colIndex) in item.columns" :key="colIndex" :span="col.span">


              <template v-for="citem in col.list" >
                <el-form-item v-if="citem.type=='blank'" :label="citem.name" :prop="citem.model" :key="citem.key">
                  <slot :name="citem.model" :model="models"></slot>
                </el-form-item>
                <genetate-form-item v-else :key="citem.key" :models.sync="models"   :rules="rules" :widget="citem"  :readOnly="readOnly"></genetate-form-item>
              </template>
    </el-col>
    </el-row>
    </template>

    <template v-else-if="item.type == 'blank'">
          <el-form-item :label="item.name" :prop="item.model" :key="item.key">
            <slot :name="item.model" :model="models"></slot>
          </el-form-item>
        </template>

    <template v-else>
          <genetate-form-item :key="item.key" :models.sync="models" :rules="rules" :widget="item" :readOnly="readOnly"></genetate-form-item>
        </template>

    </template>
  </el-form>
</div>
</template>

<script>
import GenetateFormItem from './GenerateFormItem'

export default {
  name: 'fm-generate-form',
  components: {
    GenetateFormItem
  },
  props: {
    definitionId: null,
    value: null,
    disabled: false,
    readOnly: {
      type: Boolean,
      default: false,
      required: false
    },
  },
  data() {
    return {
      data: {
        config: {},
      },
      models: {},
      rules: {},
    }
  },
  created() {
    if (this.definitionId) {
      let json = tapp.data.base_extend_field_definition.find(p => p.id === this.definitionId).json;
      if (json) {
        this.data = JSON.parse(json);
        this.generateModle(this.data.list)
      }
    }
  },
  methods: {
    generateModle(genList) {
      for (let i = 0; i < genList.length; i++) {
        if (genList[i].type === 'grid') {
          genList[i].columns.forEach(item => {
            this.generateModle(item.list)
          })
        } else {
          let values = this.value || {};
          if (Object.keys(values).indexOf(genList[i].model) >= 0) {
            this.models[genList[i].model] = values[genList[i].model]
          } else {
            if (genList[i].type === 'blank') {
              this.models[genList[i].model] = genList[i].options.defaultType === 'String' ? '' : (genList[i].options.defaultType === 'Object' ? {} : [])
            } else {
              this.models[genList[i].model] = genList[i].options.defaultValue
            }

          }

          if (this.rules[genList[i].model]) {
            this.rules[genList[i].model] = [...this.rules[genList[i].model], ...genList[i].rules]
          } else {
            this.rules[genList[i].model] = [...genList[i].rules]
          }

        }
      }
    },
    resetFields() {
      this.$refs.generateForm.resetFields();
    },
    validate() {
      return this.$refs.generateForm.validate();
    },
    clearValidate() {
      this.$refs.generateForm.clearValidate();
    },
  },
  watch: {
    value: {
      deep: true,
      handler(val) {
        if (!val) {
          this.models = {};
        } else if (typeof val == 'object') {
          this.models = val;
        } else if (typeof val == 'string') {
          this.models = JSON.parse(val);
        } else {
          throw new Error("value参数无效");
        }
      }
    },
    models: {
      deep: true,
      handler(val) {
        this.$emit('input', val);
      }
    }
  }
}
</script>
