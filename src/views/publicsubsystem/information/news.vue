<template>
<div class="content">
  <ul>
    <li v-for="item in data" :key="item.id">
      <router-link :to="{ path: '/publicsubsystem/information/newsView?id=' + item.id }">
        <div class="left"><img :src="getFileUrl(item)" :alt="item.title"/></div>
        <div class="right">
          <div class="right_top">
            <h3>{{item.title}}</h3>
          </div>
          <div class="right_bottom">
            <div class="right_bottom_left">
              {{item.summary}}
            </div>
          </div>
        </div>
      </router-link>
    </li>
  </ul>
</div>
</template>
<script>
export default {
  props: {
    classificationId: null,
  },
  data() {
    return {
      data: [],
    }
  },
  components: {},
  created() {
    let self = this;
    tapp.services.base_Information.getList({
      'categoryId': this.classificationId
    }).then(function(result) {
      self.data = result;
    });
  },
  mounted() {},
  computed: {

  },
  methods: {
    getFileUrl(item) {
      if (!item) {
        return null;
      }
      return window.SITE_CONFIG['serverUrl'] + "/pmtapi/base_AssetManagement/view?tb=1&bid=" + item.id + '&acid=base_information';
    },
    doRead(id) {
      let path = '/publicsubsystem/information/newsView?id=' + row.id;
      this.$router.push({
        path: path,
      });
    },
  }
}
</script>
<style scoped>
.content ul li img:hover {
  transform: scale(1.2);
  /*当鼠标移动到图片上时实现放大功能*/
}

.content ul li {
  height: 100px;
  overflow: hidden;
  border-bottom: 1px solid lavender;
  background: white;
  list-style-type: none;
  transition-duration: 0.5s;
  margin: 10px 10px 5px 0;
}

.content ul li:hover {
  background-color: lavender;
  transition-duration: 0.5s;
}

.content .left {
  overflow: hidden;
  /*隐藏溢出图片内容*/
  transition-duration: 0.5s;
  width: 140px;
  height: 80px;
  /*background: green;*/
  float: left;
  margin-right: 20px;
}

.content .right {
  width: 400px;
  float: left;
  /*background: pink;*/
}

.right_top {
  height: 30px;
}

.right_bottom {
  margin_top: 50px;
}

.right_bottom_left span {
  color: darkgray;
  font-size: 12px;
}
</style>
