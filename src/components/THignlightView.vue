<template>

  <span class="highlight" style="font-size:14px">{{currentValue }}</span>

</template>
<script>
export default {
  props: {
    value:{
      type: String,
      required: false
    },
  },
  data() {
    return {}
  },
  computed: {
    currentValue: {
      // 动态计算currentValue的值
      get: function() {
        if (!this.value) {
          return '';
        }
        return this.value;
      },
    }
  },
  watch: {

  },
  mounted() {

  },
  methods: {}
}
</script>
