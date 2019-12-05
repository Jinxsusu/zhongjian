
<template>
</template>
<script>
import {
  mapMutations,
  mapState,
} from 'vuex'

export default {
  data() {
    return {
      baseData: {
        _oldRoutePath: '',
        _routeChanged: true,
      }
    }
  },
  computed: {
    ...mapState({
      path: state => state.route.path,
      contentTabs: state => state.ui.contentTabs,
      isLoading: state => state.ui.isLoading,
    }),
    routeChanged: {
      get: function() { 
        return this.baseData._routeChanged;
      },
    },
  },
  created() {},
  activated() {
    this.baseData._routeChanged = this.$route.fullPath != this.baseData._oldRoutePath;
    this.baseData._oldRoutePath = this.$route.fullPath;
  },
  beforeRouteLeave: function(to, from, next) {
    let fromPath = from.fullPath;
    let foundTabNavIndex = this.contentTabs.findIndex(p => {
      return p.url == fromPath;
    })
    if (foundTabNavIndex < 0) {
      //https://github.com/vuejs/vue/issues/6509
      if (this.$vnode && this.$vnode.data.keepAlive) {
        if (this.$vnode.parent && this.$vnode.parent.componentInstance && this.$vnode.parent.componentInstance.cache) {
          if (this.$vnode.componentOptions) {
            var key = this.$vnode.key == null ?
              this.$vnode.componentOptions.Ctor.cid + (this.$vnode.componentOptions.tag ? `::${this.$vnode.componentOptions.tag}` : '') :
              this.$vnode.key;
            var cache = this.$vnode.parent.componentInstance.cache;
            var keys = this.$vnode.parent.componentInstance.keys;
            if (cache[key]) {
              if (keys.length) {
                var index = keys.indexOf(key);
                if (index > -1) {
                  keys.splice(index, 1);
                }
              }
              delete cache[key];
            }
          }
        }
      }
      this.$destroy();
    }
    next();
  },
  methods: {
    resetData() {
      let {
        baseData
      } = this.$data;

      //data恢复初始化数据
      Object.assign(this.$data, this.$options.data(), {
        'baseData': baseData
      });
    },
  }
}
</script>
