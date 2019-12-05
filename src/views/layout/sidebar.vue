<template>
  <!-- 这是 侧边栏 -->
  <aside class="site-sidebar" :class="sidebarClasses">
    <div class="site-sidebar__inner">
      <el-menu :default-active="menuNavActiveName" :collapse="$store.state.ui.sidebarCollapse" :collapseTransition="false" class="site-sidebar__menu">
      <sub-menu-nav v-for="menuNav in menuNavList" :key="menuNav.self.id" :menu-nav="menuNav">
      </sub-menu-nav>
      </el-menu>
    </div>
  </aside>
</template>

<script>
import SubMenuNav from '@/components/sub-menu-nav'

import { mapMutations, mapState } from 'vuex'
import { getRouteNameByUrl } from '@/util'
import isEmpty from 'lodash/isEmpty'
import appRouterHelper from '@/router/appRouterHelper'
import router from '@/router'

export default {
  data () {
    return {
      menuNavActiveName: null,
      menuNavList: []
    }
  },
  components: {
    SubMenuNav
  },
  computed: {
    ...mapState({
      path: state => state.route.path
    }),
    sidebarClasses () {
      let skin = this.$store.state.ui.sidebarLayoutSkin
      return [
        !/\S/.test(skin) || skin === 'light' ? '' : `site-sidebar--${skin}`
      ]
    }
  },
  watch: {
    $route: 'routeHandle'
  },
  mounted () {},
  created () {
    this.getUserSystemInfo()
  },
  methods: {
    // 获取菜单导航列表 / 权限
    getUserSystemInfo () {
      let self = this
      self.$http
        .post('/authapi/base_Account/getUserSystemInfo', {})
        .then(function (response) {
          let {
            authoritiyNavigationTree,
            notificationCount,
            permissions
          } = response
          self.menuNavList = authoritiyNavigationTree || []
          self.routeHandle(self.$route)
          self.$store.commit('setNotificationNum', notificationCount)
          self.$store.commit('setPermissions', permissions)
        })
        .catch(function (error) {
          window.console && console.log(error)
          // self.$message.error(error);
        })
    },
    // 路由操作
    routeHandle (route) {
      debugger
      if (route.meta && route.meta.isTab) {
        let tab = {
          id: route.name,
          name: route.name,
          title: route.meta.title,
          type:
            (window.SITE_CONFIG.nestIframeRouteNameList || []).indexOf(
              route.name
            ) !== -1
              ? 'iframe'
              : 'module',
          url: route.fullPath,
          show: route.meta.show
        }
        this.ADD_CONTENT_TAB(tab)

        this.menuNavActiveName = route.name
        this.UPDATE_CONTENT_TABS_ACTIVE_NAME({
          name: route.name
        })
      }
    },

    ...mapMutations(['ADD_CONTENT_TAB', 'UPDATE_CONTENT_TABS_ACTIVE_NAME'])
  }
}
</script>
<style>
#driver-highlighted-element-stage {
  opacity: 0.1;
}
</style>
