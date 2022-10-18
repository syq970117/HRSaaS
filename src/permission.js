// 权限拦截 导航守卫 路由守卫 router
import router from '@/router' // 引入路由实例
import store from '@/store' // 引入vuex store实例
import NProgress from 'nprogress' // 引入进度条插件
import 'nprogress/nprogress.css' // 引入进度条样式

const whiteList = ['/login', '/404'] // 定义白名单，包含所有不受权限控制的页面
// 前置守卫
router.beforeEach(function(to, from, next) {
  NProgress.start() // 开启进度条
  // 首先判断有无token
  if (store.getters.token) {
    // 如果有token，判断是否去登录页
    if (to.path === '/login') {
      next('/') // 跳到主页
    } else {
      next() // 直接放行
    }
  } else {
    // 没有token
    if (whiteList.indexOf(to.path) > -1) {
      // 该路径存在白名单
      next()
    } else {
      next('/login')
    }
  }

  NProgress.done() // 解决手动切换地址，进度条不关闭的问题
})

// 后置守卫
router.afterEach(function() {
  NProgress.done() // 关闭进度条
})
