
<template>
</template>

<script>
export default {
  data() {
    return {}
  },
  created() {
    this.logoutHandle();
  },
  activated() {

  },
  methods: {
    // 退出
    logoutHandle() {
      let self = this;
      let config = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
      };
      self.$http.post('/authapi/base_Account/loginout', {}, config).then(function(response) { 
        self.$store.commit('loginOut');
        window.location.href = window.SITE_CONFIG['domain'] + 'login';
      }).catch(function(error) {
        //self.$message.error(error);
        window.console && console.log(error);
      });
    },
  }
}
</script>
