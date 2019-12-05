<template>
<el-form-item ref="formItem" :label="widget.name" :prop="widget.model" verify :can-be-empty="widget.options && widget.options.required?undefined:'true'" :maxLength="widget.options && widget.options.maxLength?widget.options.maxLength:undefined" :class="{'is-required': widget && widget.options && widget.options.required,'el-form-item-no-label':widget.formType && widget.formType == 'info'}">

  <template v-if="widget.type == 'alert'">
      <el-alert
    :title="widget.options.title"
    :type="widget.options.type"
    :description="widget.options.description"
    :show-icon="widget.options.showIcon"
    :closable="false">
    </el-alert>
    </template>
  <template v-if="widget.type == 'title'">
          <h5>{{widget.options.title}}</h5>
      <hr class="el-row-hr" />
    </template>
  <template v-if="widget.type == 'input'">
      <t-input
	v-model="dataModel"
    :readOnly="readOnly"
	:placeholder="widget.options.placeholder"
	:style="{width: widget.options.width}">
  <span slot="append" v-if="widget.options.appendText">{{widget.options.appendText}}</span>
	</t-input>
  </template>

  <template v-if="widget.type == 'textarea'">
      <t-input type="textarea" :rows="5"
        v-model="dataModel"
        :readOnly="readOnly"
        :disabled="widget.options.disabled"
        :placeholder="widget.options.placeholder"
        :style="{width: widget.options.width}"
      > </t-input>
    </template>

  <template v-if="widget.type == 'currency'">
          <t-currency-input
            v-model="dataModel"
              :readOnly="readOnly"
            :disabled="widget.options.disabled"
            :style="{width: widget.options.width}"
             :unit-value="widget.options.unitValue"
          >    <span slot="append" v-if="widget.options.appendText">{{widget.options.appendText}}</span>
          </t-currency-input>
        </template>
  <template v-if="widget.type == 'percent'">
          <t-percent-input
            v-model="dataModel"
              :readOnly="readOnly"
            :disabled="widget.options.disabled"
            :style="{width: widget.options.width}"
          >  <span slot="append" v-if="widget.options.appendText">{{widget.options.appendText}}</span></t-percent-input>
        </template>
  <template v-if="widget.type == 'int'">
          <t-int-input
            v-model="dataModel"
            :readOnly="readOnly"
            :disabled="widget.options.disabled"
            :style="{width: widget.options.width}"
            :placeholder="widget.options.placeholder"
          >  <span slot="append" v-if="widget.options.appendText">{{widget.options.appendText}}</span></t-int-input>
        </template>
  <template v-if="widget.type == 'number'">
          <t-number-input
            v-model="dataModel"
            :readOnly="readOnly"
            :disabled="widget.options.disabled"
            :style="{width: widget.options.width}"
          >  <span slot="append" v-if="widget.options.appendText">{{widget.options.appendText}}</span></t-number-input>
        </template>

  <template v-if="widget.type == 'select'">
          <t-dic-dropdown-select  v-if="widget.options.dataDicCategory && widget.options.dataDicCategoryValue"
            :multiple="widget.options.multiple"
            :clearable="widget.options.clearable"
            :dicType="widget.options.dataDicCategoryValue"
            v-model="dataModel"
            :readOnly="readOnly">
          </t-dic-dropdown-select> 
            <t-dic-dropdown-select  v-else
            :multiple="widget.options.multiple"
            :clearable="widget.options.clearable"
            :data="widget.options.options"
            v-model="dataModel"
            :readOnly="readOnly">
          </t-dic-dropdown-select>

        </template>
  <template v-if="widget.type == 'radio'">
         <t-dic-radio-select v-if="widget.options.dataDicCategory && widget.options.dataDicCategoryValue"
         :inline="widget.options.inline"
         :dicType="widget.options.dataDicCategoryValue"
         v-model="dataModel"
        :readOnly="readOnly"></t-dic-radio-select>

         <t-dic-radio-select v-else
         :inline="widget.options.inline"
         :data="widget.options.options"
         v-model="dataModel"
        :readOnly="readOnly"></t-dic-radio-select>
        </template>

  <template v-if="widget.type == 'checkbox'">
         <t-dic-checkbox-select v-if="widget.options.dataDicCategory && widget.options.dataDicCategoryValue" :inline="widget.options.inline"
         :dicType="widget.options.dataDicCategoryValue"
         v-model="dataModel"
        :readOnly="readOnly" ></t-dic-checkbox-select>

 <t-dic-checkbox-select  v-else :inline="widget.options.inline"
         :data="widget.options.options"
         v-model="dataModel"
        :readOnly="readOnly" ></t-dic-checkbox-select>
        </template>

  <template v-if="widget.type == 'tree'">
        <t-dic-multi-tree-select v-if="widget.options.multiple"
                 :dicType="widget.options.dataDicCategoryValue"
         v-model="dataModel"
        :readOnly="readOnly"> </t-dic-multi-tree-select>
         <t-dic-tree-select  v-else  :dicType="widget.options.dataDicCategoryValue"
         v-model="dataModel"
        :readOnly="readOnly"></t-dic-tree-select>
        </template>

  <template v-if="widget.type == 'time'">
      <t-time-picker
        v-model="dataModel"
        :is-range="widget.options.isRange"
        :placeholder="widget.options.placeholder"
        :start-placeholder="widget.options.startPlaceholder"
        :end-placeholder="widget.options.endPlaceholder"
        :readOnly="readOnly"
        :disabled="widget.options.disabled"
        :editable="widget.options.editable"
        :clearable="widget.options.clearable"
        :arrowControl="widget.options.arrowControl"
        :value-format="widget.options.format"
        :style="{width: widget.options.width}"
      >
      </t-time-picker>
    </template>

  <template v-if="widget.type=='date' ">
      <t-datetime-picker
        v-model="dataModel"
        :type="widget.options.type"
        :placeholder="widget.options.placeholder"
        :start-placeholder="widget.options.startPlaceholder"
        :end-placeholder="widget.options.endPlaceholder"
        :readOnly="readOnly"
        :disabled="widget.options.disabled"
        :editable="widget.options.editable"
        :clearable="widget.options.clearable"
        :value-format="widget.options.timestamp ? 'timestamp' : widget.options.format"
        :format="widget.options.format"
        :style="{width: widget.options.width}"
      >
      </t-datetime-picker>
    </template>

  <template v-if="widget.type =='rate'">
      <el-rate v-model="dataModel"
        :max="widget.options.max"
        :disabled="widget.options.disabled"
        :allow-half="widget.options.allowHalf"
      ></el-rate>
    </template>

  <template v-if="widget.type == 'color'">
      <el-color-picker
        v-model="dataModel"
        :disabled="widget.options.disabled"
        :show-alpha="widget.options.showAlpha"
      ></el-color-picker>
    </template>

  <template v-if="widget.type=='switch'">
      <t-switch
        v-model="dataModel"
        :readOnly="readOnly"
        :disabled="widget.options.disabled"
      >
      </t-switch>
    </template>

  <template v-if="widget.type=='slider'">
      <el-slider
        v-model="dataModel"
        :min="widget.options.min"
        :max="widget.options.max"
        :disabled="widget.options.disabled"
        :step="widget.options.step"
        :show-input="widget.options.showInput"
        :range="widget.options.range"
        :style="{width: widget.options.width}"
      ></el-slider>
    </template>

</el-form-item>
</template>

<script>
export default {
  props: {
    widget: null,
    models: null,
    rules: null,
    readOnly: {
      type: Boolean,
      default: false,
      required: false
    },
  },
  components: {

  },
  data() {
    return {
      dataModel: this.models[this.widget.model]
    }
  },
  created() {},
  mounted() {

    let formItem = this.$refs.formItem;

  },
  watch: {
    dataModel: {
      deep: true,
      handler(val) {
        this.models[this.widget.model] = val
        this.$emit('update:models', {
          ...this.models,
          [this.widget.model]: val
        })
      }
    },
    models: {
      deep: true,
      handler(val) {
        this.dataModel = val[this.widget.model]
      }
    }
  }
}
</script>
