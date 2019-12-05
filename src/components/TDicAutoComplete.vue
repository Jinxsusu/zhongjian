/**
* 字典AutoComplete 控件
*/
<template>
<div>
  <el-autocomplete ref="input" v-model="currentValue" @blur="setCurrentValue" @select="setCurrentValue" :fetch-suggestions="querySearch" value-key="name" v-if="!readOnly"></el-autocomplete>
  <div v-else class="t-readonly  t-dic-auto-complete-readonly-div">
    <span v-for="tag in selectedData" :key="tag.id"> {{tag.name}}</span>
  </div>
</div>
</template>

<script>
export default {
  name: 'DicAutoComplete',
  props: {
    /**
     * 字典类别
     */
    dicType: {
      type: String,
      required: false
    },
    data: {
      type: Array,
      default: null,
      required: false
    },
    value: {},
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
  data: function() {
    return {
      selectValue: null,
      innerData: [],
    }
  },
  computed: {},
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
        let tdata = [];
        if (newValue) {
          this.innerData = newValue;
        }
      },
      immediate: true,
    },
  },
  created() {
    this.currentValue = this.value;
  },
  mounted() {},
  methods: {
    setCurrentValue(newObject) {
      let newVal = null;
      if (newObject.currentTarget) {
        newVal = newObject.currentTarget.value;
      } else {
        newVal = newObject == null ? '' : newObject.Name;
      }
      this.currentValue = newVal;
    },
    querySearch(queryString, cb) {
      var list = this.innerData;
      if (list == null) {
        cb([]);
        return;
      }
      let results = queryString ? list.filter(this.createFilter(queryString)) : list;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return (item) => {
        return (item.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
  }
}
</script>
