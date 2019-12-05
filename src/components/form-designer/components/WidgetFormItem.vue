<template>
<div>
  <el-form-item class="widget-view " v-if="element && element.key" :class="{active: element && selectWidget && selectWidget.key == element.key, 'is-required': element && element.options && element.options.required,'el-form-item-no-label':element.formType && element.formType == 'info'}"
    :label="element.name" @click.native="handleSelectWidget(index)">
    <template v-if="element.type == 'alert'">
      <el-alert
    :title="element.options.title"
    :type="element.options.type"
    :description="element.options.description"
    :show-icon="element.options.showIcon"
    :closable="false">
    </el-alert>
    </template>
    <template v-if="element.type == 'title'">
          <h5>{{element.options.title}}</h5>
      <hr class="el-row-hr" />
    </template>
    <template v-if="element.type == 'input'">
          <t-input
            v-model="element.options.defaultValue"
            :style="{width: element.options.width}"
            :disabled="element.options.disabled"
            :placeholder="element.options.placeholder"
          >
            <span slot="append" v-if="element.options.appendText">{{element.options.appendText}}</span>
          </t-input>
        </template>

    <template v-if="element.type == 'textarea'">
          <t-input type="textarea" :rows="5"
            v-model="element.options.defaultValue"
            :style="{width: element.options.width}"
            :disabled="element.options.disabled"
            :placeholder="element.options.placeholder"
          ></t-input>
        </template>

    <template v-if="element.type == 'currency'">
          <t-currency-input
            v-model="element.options.defaultValue"
            :disabled="element.options.disabled"
            :style="{width: element.options.width}"
            :placeholder="element.options.placeholder"
            :unit-value="element.options.unitValue"
          >  <span slot="append" v-if="element.options.appendText">{{element.options.appendText}}</span></t-currency-input>
        </template>
    <template v-if="element.type == 'percent'">
          <t-percent-input
            v-model="element.options.defaultValue"
            :disabled="element.options.disabled"
            :style="{width: element.options.width}"
              :placeholder="element.options.placeholder"
          >  <span slot="append" v-if="element.options.appendText">{{element.options.appendText}}</span></t-percent-input>
        </template>
    <template v-if="element.type == 'int'">
          <t-int-input
            v-model="element.options.defaultValue"
            :disabled="element.options.disabled"
            :style="{width: element.options.width}"
            :placeholder="element.options.placeholder"
          >  <span slot="append" v-if="element.options.appendText">{{element.options.appendText}}</span></t-int-input>
        </template>
    <template v-if="element.type == 'number'">
          <t-number-input
            v-model="element.options.defaultValue"
            :disabled="element.options.disabled"
            :style="{width: element.options.width}"
            :placeholder="element.options.placeholder"
          >  <span slot="append" v-if="element.options.appendText">{{element.options.appendText}}</span></t-number-input>
        </template>
    <template v-if="element.type == 'select'">
          <t-dic-dropdown-select  v-if="element.options.dataDicCategory && element.options.dataDicCategoryValue"
            :multiple="element.options.multiple"
            :clearable="element.options.clearable"
            :dicType="element.options.dataDicCategoryValue" v-model="element.options.defaultValue"></t-dic-dropdown-select>

          <el-select v-else
            v-model="element.options.defaultValue"
            :disabled="element.options.disabled"
            :multiple="element.options.multiple"
            :clearable="element.options.clearable"
            :placeholder="element.options.placeholder"
            :style="{width: element.options.width}"
          >
            <el-option v-for="item in element.options.options" :key="item.value" :value="item.value" :label="element.options.showLabel?item.label:item.value"></el-option>
          </el-select>
        </template>
    <template v-if="element.type == 'radio'">
         <t-dic-radio-select v-if="element.options.dataDicCategory && element.options.dataDicCategoryValue" :inline="element.options.inline"  :dicType="element.options.dataDicCategoryValue" v-model="element.options.defaultValue"></t-dic-radio-select>

          <el-radio-group v-model="element.options.defaultValue"  v-else
            :style="{width: element.options.width}"
          >
            <el-radio
              :style="{display: element.options.inline ? 'inline-block' : 'block'}"
              :label="item.value" v-for="(item, index) in element.options.options" :key="item.value + index"
            >
              {{element.options.showLabel ? item.label : item.value}}
            </el-radio>
          </el-radio-group>
        </template>

    <template v-if="element.type == 'checkbox'">
         <t-dic-checkbox-select v-if="element.options.dataDicCategory && element.options.dataDicCategoryValue" :inline="element.options.inline"  :dicType="element.options.dataDicCategoryValue" v-model="element.options.defaultValue"></t-dic-checkbox-select>

          <el-checkbox-group v-model="element.options.defaultValue"   v-else
            :style="{width: element.options.width}"
          >
            <el-checkbox
              :style="{display: element.options.inline ? 'inline-block' : 'block'}"
              :label="item.value" v-for="(item, index) in element.options.options" :key="item.value + index"
            >
              {{element.options.showLabel ? item.label : item.value}}
            </el-checkbox>
          </el-checkbox-group>
        </template>
      <template v-if="element.type == 'tree'">
        <t-dic-multi-tree-select v-if="element.options.multiple" :dicType="element.options.dataDicCategoryValue" v-model="element.options.defaultValue"> </t-dic-multi-tree-select>
         <t-dic-tree-select  v-else  :dicType="element.options.dataDicCategoryValue" v-model="element.options.defaultValue"></t-dic-tree-select>

        </template>
    <template v-if="element.type == 'time'">
          <el-time-picker
            v-model="element.options.defaultValue"
            :is-range="element.options.isRange"
            :placeholder="element.options.placeholder"
            :start-placeholder="element.options.startPlaceholder"
            :end-placeholder="element.options.endPlaceholder"
            :readonly="element.options.readonly"
            :disabled="element.options.disabled"
            :editable="element.options.editable"
            :clearable="element.options.clearable"
            :arrowControl="element.options.arrowControl"
            :style="{width: element.options.width}"
          >
          </el-time-picker>
        </template>

    <template v-if="element.type == 'date'">
          <el-date-picker
            v-model="element.options.defaultValue"
            :type="element.options.type"
            :is-range="element.options.isRange"
            :placeholder="element.options.placeholder"
            :start-placeholder="element.options.startPlaceholder"
            :end-placeholder="element.options.endPlaceholder"
            :readonly="element.options.readonly"
            :disabled="element.options.disabled"
            :editable="element.options.editable"
            :clearable="element.options.clearable"
            :style="{width: element.options.width}"
          >
          </el-date-picker>
        </template>

    <template v-if="element.type == 'rate'">
          <el-rate v-model="element.options.defaultValue"
            :max="element.options.max"
            :disabled="element.options.disabled"
            :allow-half="element.options.allowHalf"
          ></el-rate>
        </template>

    <template v-if="element.type == 'color'">
          <el-color-picker
            v-model="element.options.defaultValue"
            :disabled="element.options.disabled"
            :show-alpha="element.options.showAlpha"
          ></el-color-picker>
        </template>



    <template v-if="element.type=='switch'">
          <el-switch
            v-model="element.options.defaultValue"
            :disabled="element.options.disabled"
          >
          </el-switch>
        </template>

    <template v-if="element.type=='slider'">
          <el-slider
            v-model="element.options.defaultValue"
            :min="element.options.min"
            :max="element.options.max"
            :disabled="element.options.disabled"
            :step="element.options.step"
            :show-input="element.options.showInput"
            :range="element.options.range"
            :style="{width: element.options.width}"
          ></el-slider>
        </template>


    <template v-if="element.type=='blank'">
          <div style="height: 50px;color: #999;background: #eee;line-height:50px;text-align:center;">自定义区域</div>
        </template>

    <el-button title="删除" @click.stop="handleWidgetDelete(index)" class="widget-action-delete" v-if="element && selectWidget && selectWidget.key == element.key" circle plain type="danger">
      <icon name="regular/trash-alt" style="width: 12px;height: 12px;"></icon>
    </el-button>
    <el-button title="复制" @click.stop="handleWidgetClone(index)" class="widget-action-clone" v-if="element && selectWidget && selectWidget.key == element.key" circle plain type="primary">
      <icon name="regular/clone" style="width: 12px;height: 12px;"></icon>
    </el-button>

  </el-form-item>
</div>
</template>

<script>
export default {
  props: ['element', 'select', 'index', 'data'],
  components: {

  },
  data() {
    return {
      selectWidget: this.select
    }
  },
  methods: {
    handleSelectWidget(index) {
      this.selectWidget = this.data.list[index]
    },
    handleWidgetDelete(index) {
      if (this.data.list.length - 1 === index) {
        if (index === 0) {
          this.selectWidget = {}
        } else {
          this.selectWidget = this.data.list[index - 1]
        }
      } else {
        this.selectWidget = this.data.list[index + 1]
      }

      this.$nextTick(() => {
        this.data.list.splice(index, 1)
      })
    },
    handleWidgetClone(index) {
      let cloneData = {
        ...this.data.list[index],
        options: { ...this.data.list[index].options
        },
        key: Date.parse(new Date()) + '_' + Math.ceil(Math.random() * 99999)
      }

      if (this.data.list[index].type === 'radio' || this.data.list[index].type === 'checkbox') {

        cloneData = {
          ...cloneData,
          options: {
            ...cloneData.options,
            options: cloneData.options.options.map(item => ({ ...item
            }))
          }
        }
      }

      this.data.list.splice(index, 0, cloneData)

      this.$nextTick(() => {
        this.selectWidget = this.data.list[index + 1]
      })
    },
  },
  watch: {
    select(val) {
      this.selectWidget = val
    },
    selectWidget: {
      handler(val) {
        this.$emit('update:select', val)
      },
      deep: true
    }
  }
}
</script>
