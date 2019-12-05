<template>
<div class="form-config-container">
  <el-form label-position="top" size="small"> 
    <el-form-item label="表单字段宽度">
      <el-input-number v-model="data.labelWidth" :min="0" :max="200" :step="10"></el-input-number>
    </el-form-item>
  </el-form>
</div>
</template>
<script>
export default {
  props: ['data']
}
</script>
