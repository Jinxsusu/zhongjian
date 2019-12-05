
<template>
<div>
  <el-form ref="form" label-width="120px">
    <el-form-item label="链接">
      <el-input v-model="config.value" :readonly="true" style="width:360px"></el-input>
      <el-button id="copyUrl" v-clipboard:copy="config.value" v-clipboard:success="onCopySucess" v-clipboard:error="onCopyError" type="primary">复制</el-button>
    </el-form-item>
    <el-form-item label="二维码" style="margin:0px auto;">
      <vue-q-art ref="qart" v-if="config.value" :config="config" :download="download" style="width:200px; height:200px; display:inline-block"></vue-q-art>
      <el-button id="downloadButton" type="primary" @click="onDownloadQR()">下载</el-button>
    </el-form-item>
  </el-form>
</div>
</template>

<script>
import {
  mapState,
  mapGetters,
  mapActions
} from 'vuex'

import VueQArt from 'vue-qart';
import Clipboad from 'clipboard';
export default {
  props: {
    url: {
      type: String,
      default: null,
    }
  },
  data() {
    return {
      config: {
        value: null,
        imagePath: this.$util.getRealPath() +  window.SITE_CONFIG.cdnUrl + 'static/img/favicon.ico',
      },
      download: {
        visible: false,
        text: '我的二维码',
      },
    }
  },
  components: {
    VueQArt
  },
  created() {
  },
  activated() {

  },
  computed: {
  },
  watch: {
    url: {　　　　
      handler(newValue, oldValue) {　
        this.config.value = newValue;
      },
      immediate: true,
    },
  },
  methods: {
    onCopySucess: function() {
      this.$notify.success({
        title: '复制成功！',
        message: '复制成功！',
      });   
    },
    onCopyError: function() {
      this.$notify.error({
        title: '错误',
        message: '复制失败，请手工操作！'
      });   

    },
    onDownloadQR() {
      const myCanvas = this.$refs.qart.$el.children[0].children[0];
      const type = 'image/png';
      let imgURL = myCanvas.toDataURL(type).replace(type, "image/octet-stream");

      var dlLink = document.createElement('a');
      dlLink.download = '我的二维码.png';
      dlLink.href = imgURL;

      document.body.appendChild(dlLink);
      dlLink.click();
      document.body.removeChild(dlLink);

    }
  }
}
</script>

<style type="text/css">
</style>
