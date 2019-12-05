export const basicComponents = [{
    type: 'alert',
    name: '页面提示',
    formType: 'info', //input,info
    icon: 'bell',
    options: {
      type: 'warning',
      title: '请输入标题',
      description: '请输入描述',
      showIcon: true,
    }
  },
  {
    type: 'title',
    name: '标题',
    formType: 'info', //input,info
    icon: 'info',
    options: {
      title: '请输入标题',
    }
  },
  {
    type: 'input',
    name: '单行文本',
    formType: 'input', //input,info
    icon: 'regular/keyboard',
    options: {
      defaultValue: '',
      required: false,
      disabled: false,
      placeholder: '',
      maxLength: 50,
      appendText: null, //控件后附加文本
    }
  },
  {
    type: 'textarea',
    name: '多行文本',
    formType: 'input', //input,info
    icon: 'regular/keyboard',
    options: {
      defaultValue: '',
      required: false,
      disabled: false,
      placeholder: '',
      maxLength: 200,
    }
  },
  {
    type: 'currency',
    name: '货币',
    formType: 'input', //input,info
    icon: 'regular/money-bill-alt',
    options: {
      defaultValue: null,
      required: false,
      disabled: false,
      placeholder: '',
      appendText: null, //控件后附加文本
      unitValue: 1, //货币单位
    }
  },
  {
    type: 'percent',
    name: '百分比',
    formType: 'input', //input,info
    icon: 'percent',
    options: {
      defaultValue: null,
      required: false,
      disabled: false,
      placeholder: '',
      appendText: null, //控件后附加文本
    }
  },
  {
    type: 'int',
    name: '整形输入',
    formType: 'input', //input,info
    icon: 'plus',
    options: {
      defaultValue: null,
      required: false,
      disabled: false,
      placeholder: '',
      appendText: null, //控件后附加文本
    }
  },
  {
    type: 'number',
    name: '数字输入',
    formType: 'input', //input,info
    icon: 'sort-numeric-up',
    options: {
      defaultValue: null,
      required: false,
      disabled: false,
      placeholder: '',
      appendText: null, //控件后附加文本
    }
  },
  {
    type: 'select',
    name: '下拉选择框',
    formType: 'input', //input,info
    icon: 'regular/caret-square-down',
    options: {
      defaultValue: '',
      multiple: false,
      disabled: false,
      clearable: false,
      placeholder: '',
      required: false,
      options: [{
          value: '下拉框1',
          label: '下拉框1'
        },
        {
          value: '下拉框2',
          label: '下拉框2'
        }, {
          value: '下拉框3',
          label: '下拉框3'
        }
      ],
      dataDicCategory: false,
      dataDicCategoryValue: null,
    }
  },
  {
    type: 'radio',
    name: '单选框组',
    formType: 'input', //input,info
    icon: 'regular/dot-circle',
    options: {
      inline: true,
      defaultValue: '',
      disabled: false,
      required: false,
      options: [{
          value: '选项1',
          label: '选项1'
        },
        {
          value: '选项2',
          label: '选项2'
        },
        {
          value: '选项3',
          label: '选项3'
        }
      ],
      required: false,
      dataDicCategory: false,
      dataDicCategoryValue: null,
    }
  },
  {
    type: 'checkbox',
    name: '多选框组',
    formType: 'input', //input,info
    icon: 'regular/check-square',
    options: {
      inline: true,
      defaultValue: [],
      options: [{
          value: '选项1',
          label: '选项1'
        },
        {
          value: '选项1',
          label: '选项1'
        },
        {
          value: '选项1',
          label: '选项1'
        }
      ],
      disabled: false,
      required: false,
      dataDicCategory: false,
      dataDicCategoryValue: null,
    }
  },
    {
    type: 'tree',
    name: '树形选择框',
    formType: 'input', //input,info
    icon: 'regular/caret-square-down',
    options: {
      defaultValue: '',
      multiple: false,
      disabled: false,
      clearable: false,
      placeholder: '',
      required: false,
      dataDicCategory: false,
      dataDicCategoryValue: null,
    }
  },
  {
    type: 'time',
    name: '时间选择器',
    formType: 'input', //input,info
    icon: 'regular/clock',
    options: {
      defaultValue: '21:19:56',
      readOnly: false,
      disabled: false,
      editable: true,
      clearable: true,
      placeholder: '',
      startPlaceholder: '',
      endPlaceholder: '',
      isRange: false,
      arrowControl: true,
      format: 'HH:mm:ss',
      required: false,
      width: '',
    }
  },
  {
    type: 'date',
    name: '日期选择器',
    formType: 'input', //input,info
    icon: 'regular/calendar-alt',
    options: {
      defaultValue: '',
      readOnly: false,
      disabled: false,
      editable: true,
      clearable: true,
      placeholder: '',
      startPlaceholder: '',
      endPlaceholder: '',
      type: 'date',
      format: 'yyyy-MM-dd',
      timestamp: false,
      required: false,
      width: '',
    }
  },
  {
    type: 'switch',
    name: '开关',
    formType: 'input', //input,info
    icon: 'toggle-off',
    options: {
      defaultValue: false,
      disabled: false,
    }
  },
  {
    type: 'rate',
    name: '评分',
    formType: 'input', //input,info
    icon: 'regular/star',
    options: {
      defaultValue: null,
      max: 5,
      disabled: false,
      allowHalf: false,
      required: false
    }
  },

  {
    type: 'slider',
    name: '滑块',
    formType: 'input', //input,info
    icon: 'sliders-h',
    options: {
      defaultValue: 0,
      disabled: false,
      required: false,
      min: 0,
      max: 100,
      step: 1,
      showInput: false,
      range: false,
      width: ''
    }
  }
]


export const layoutComponents = [{
  type: 'grid',
  name: '栅格布局',
  formType: 'info', //info,info
  icon: 'th',
  columns: [{
      span: 12,
      list: []
    },
    {
      span: 12,
      list: []
    }
  ],
  options: {
    gutter: 20,
    justify: 'start',
    align: 'top'
  }
}]
