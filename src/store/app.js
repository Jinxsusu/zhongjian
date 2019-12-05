export default {
  state: {
    axiosPromiseCancel: [],
    user: {
      userId: window.localStorage.getItem('userId'),
      userLoginId: window.localStorage.getItem('userLoginId'),
      userDisplayName: window.localStorage.getItem('userDisplayName'),
      userMobile: window.localStorage.getItem('userMobile'),
      userGrouplist: window.localStorage.getItem('userGrouplist') == null ? null : JSON.parse(window.localStorage.getItem('userGrouplist')),
      userDepartmentlist: window.localStorage.getItem('userGrouplist') == null ? null : JSON.parse(window.localStorage.getItem('userDepartmentlist')),
      userPermissions: null,
    },
  },
  getters: {
    user: state => state.user,
  },
  mutations: {
    loginIn(state, loginUser) {
      debugger;
      window.localStorage.setItem('userId', loginUser.userId)
      window.localStorage.setItem('userLoginId', loginUser.userLoginId)
      window.localStorage.setItem('userDisplayName', loginUser.userDisplayName)
      window.localStorage.setItem('userMobile', loginUser.userMobile)

      window.localStorage.setItem('userGrouplist', JSON.stringify(loginUser.userGrouplist))
      window.localStorage.setItem('userDepartmentlist', JSON.stringify(loginUser.userDepartmentlist))

      state.user.userId = loginUser.userId
      state.user.userLoginId = loginUser.userLoginId
      state.user.userDisplayName = loginUser.userDisplayName
      state.user.userMobile = loginUser.userMobile
      state.user.userGrouplist = loginUser.userGrouplist
      state.user.userDepartmentlist = loginUser.userDepartmentlist
    },
    loginOut(state) {
      window.localStorage.removeItem('userId')
      window.localStorage.removeItem('userLoginId')
      window.localStorage.removeItem('userDisplayName')
      window.localStorage.removeItem('userMobile')
      window.localStorage.removeItem('userGrouplist')
      window.localStorage.removeItem('userDepartmentlist')

      state.user.userId = ''
      state.user.userLoginId = ''
      state.user.userDisplayName = ''
      state.user.userMobile = ''
      state.user.userMobile = ''
      state.user.userGrouplist = ''
      state.user.userDepartmentlist = ''
    },
    profile(state, userInfo) {
      window.localStorage.setItem('userId', userInfo.userId)
      window.localStorage.setItem('userLoginId', userInfo.userLoginId)
      window.localStorage.setItem('userDisplayName', userInfo.userDisplayName)
      window.localStorage.setItem('userMobile', userInfo.userMobile)

      state.user.userId = userInfo.userId
      state.user.userLoginId = userInfo.userLoginId
      state.user.userDisplayName = userInfo.userDisplayName
      state.user.userMobile = userInfo.userMobile
    },
    clearAxiosPromiseCancel(state) {
      state.axiosPromiseCancel.forEach(e => {
        e && e()
      });
      state.axiosPromiseCancel = [];
    },
    setAxiosPromiseCancel(state, axiosPromiseCancelArrs) {
      state.axiosPromiseCancel = axiosPromiseCancelArrs;
    },
    setPermissions(state, permissions) {
      state.user.userPermissions = permissions;
    }
  }
}
