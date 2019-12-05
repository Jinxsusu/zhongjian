
<template>
<div class="task-info">
  <div v-for="wfTaskItem in taskDisplaylist">
    <ul style="margin:0px;padding-left: 0px;;list-style-type:none">
      <li>审批节点：{{wfTaskItem.taskActName}}</li>
      <li>创建日期：{{wfTaskItem.taskCreateDate}}</li>
      <li>{{(wfTaskItem.taskAssigneeName != null && wfTaskItem.taskAssigneeName.length > 0 ? '待处理人：' + wfTaskItem.taskAssigneeName : '待签收人：' + wfTaskItem.taskCandidateNames.join(','))}}</li>
    </ul>
    <span v-if="!!!disabled">
      <el-button size="mini" type="text"  @click="doTask(wfTaskItem)">{{ wfTaskItem.taskAssigneeName != null && wfTaskItem.taskAssigneeName.length > 0 ? '处理' : '签收' }}</el-button>
      <el-button size="mini" type="text"  @click="setAsignee(wfTaskItem)">转办</el-button>
      <el-button size="mini" type="text"  @click="doGoto(wfTaskItem)">跳转</el-button>
    </span>
  </div>
</div>
</template>

<script>
export default {
  name: 'wfTaskInfo',
  props: {
    tasklist: {
      type: Array,
      default: [],
      required: false
    },
    disabled: {
      type: Boolean,
      default: false,
      required: false
    },
  },
  data() {
    return {}
  },
  computed: {
    taskDisplaylist: {
      // 动态计算currentValue的值
      get: function() {
        if (!this.tasklist) {
          return [];
        }

        let wfTaskObject = {};
        this.tasklist.forEach(task => {
          if (!(task.taskActId in wfTaskObject)) {
            wfTaskObject[task.taskId] = [];
          }
          wfTaskObject[task.taskId].push(task);
        })

        let taskDisplays = Object.keys(wfTaskObject).map(key => {
          let wfTaskItem = this.tasklist.find(sp => sp.taskId == key);
          let wfTaskObjectItem = wfTaskObject[key];

          let candidates = wfTaskObjectItem.filter(p1 => p1.taskCandidate != null && p1.taskCandidate.length > 0).map(p => p.taskCandidate);
          let candidateNames = wfTaskObjectItem.filter(p1 => p1.taskCandidateName != null && p1.taskCandidateName.length > 0).map(p => p.taskCandidateName);

          return {
            taskId: wfTaskItem.taskId,
            taskActName: wfTaskItem.taskActName,
            taskCreateDate: wfTaskItem.taskCreateDate,
            taskFormUrl: wfTaskItem.taskFormUrl,
            taskAssignee: wfTaskItem.taskAssignee,
            taskAssigneeName: wfTaskItem.taskAssigneeName,
            taskCandidates: candidates,
            taskCandidateNames: candidateNames,
            processInstStatus: wfTaskItem.status,
            processDefinationKey: wfTaskItem.processDefinationKey,
          };
        })

        return taskDisplays;
      },
    }
  },
  created() {

  },
  activated() {

  },
  methods: {

    doTask(row) {
      this.$emit('on-task', row);
    },
    setAsignee(row) {
      this.$emit('on-setasignee', row);
    },
    doGoto(row) {
      this.$emit('on-goto', row);
    },
  }
}
</script>
