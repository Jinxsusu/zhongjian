<template>
<el-container>
  <el-aside style="wdith: 250px;">

    <div class="components-list">
      <div class="widget-cate">布局字段</div>
      <draggable element="ul" :list="layoutComponents" :options="{group:{ name:'people', pull:'clone',put:false},sort:false, ghostClass: 'ghost'}" @end="handleMoveEnd" @start="handleMoveStart" :move="handleMove">

        <li class="form-edit-widget-label data-grid" v-for="(item, index) in layoutComponents" :key="index">
          <a>
            <icon class="icon" :name="item.icon"></icon>
            <span>{{item.name}}</span>
          </a>
        </li>
      </draggable>
      <div class="widget-cate">基础字段</div>
      <draggable element="ul" :list="basicComponents" :options="{group:{ name:'people', pull:'clone',put:false},sort:false, ghostClass: 'ghost'}" @end="handleMoveEnd" @start="handleMoveStart" :move="handleMove">

        <li class="form-edit-widget-label" v-for="(item, index) in basicComponents" :key="index">
          <a>
            <icon class="icon" :name="item.icon"></icon>
            <span>{{item.name}}</span>
          </a>
        </li>
      </draggable>

    </div>

  </el-aside>
  <el-container class="center-container" direction="vertical" size="small">
    <el-main :class="{'widget-empty': widgetForm.list.length == 0}">
      <widget-form ref="widgetForm" :data="widgetForm" :select.sync="widgetFormSelect"></widget-form>
    </el-main>
  </el-container>

  <el-aside class="widget-config-container" size="small">
    <el-container>
      <el-header height="45px">
        <div class="config-tab" :class="{active: configTab=='widget'}" @click="handleConfigSelect('widget')">字段属性</div>
        <div class="config-tab" :class="{active: configTab=='form'}" @click="handleConfigSelect('form')">表单属性</div>
      </el-header>
      <el-main class="config-content">
        <widget-config v-show="configTab=='widget'" :data="widgetFormSelect"></widget-config>
        <form-config v-show="configTab=='form'" :data="widgetForm.config"></form-config>
      </el-main>
    </el-container>
  </el-aside>
</el-container>
</template>

<script>
import Draggable from 'vuedraggable'
import WidgetConfig from './WidgetConfig'
import FormConfig from './FormConfig'
import WidgetForm from './WidgetForm'
import CusDialog from './CusDialog'
import GenerateForm from './GenerateForm'

import Clipboard from 'clipboard'
import {
  basicComponents,
  layoutComponents,
} from './componentsConfig.js'

const defaultWidgetFormOptions = {
  list: [],
        config: {
          labelWidth: 100,
          labelPosition: 'left'
        },
};

export default {
  name: 'fm-making-form',
  components: {
    Draggable,
    WidgetConfig,
    FormConfig,
    WidgetForm,
    CusDialog,
    GenerateForm
  },
  data() {
    return {
      basicComponents,
      layoutComponents, 
      widgetForm: Object.assign({}, defaultWidgetFormOptions),
      configTab: 'widget',
      widgetFormSelect: null,
      widgetModels: {},
      blank: '',
    }
  },
  mounted() {

  },
  methods: {
    handleConfigSelect(value) {
      this.configTab = value
    },
    handleMoveEnd(evt) {
      console.log('end', evt)
    },
    handleMoveStart({
      oldIndex
    }) {
      console.log('start', oldIndex, this.basicComponents)
    },
    handleMove() {
      return true
    },
    getJSON() {
      return JSON.stringify(this.widgetForm);
    },
    setJSON(val) {
      this.widgetForm = val?JSON.parse(val):Object.assign({}, defaultWidgetFormOptions);
    },
  },
  watch: {
    widgetForm: {
      deep: true,
      handler: function(val) {
        console.log(this.$refs.widgetForm)
      }
    }
  }
}
</script>

<style lang="scss">
@import '../styles/cover.scss';
@import '../styles/index.scss';

.widget-empty {
    background: url('../assets/form_empty.png') no-repeat;
    background-position: 50%;
}
</style>
