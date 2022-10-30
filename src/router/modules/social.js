// 员工路由规则
import Layout from '@/layout'
export default {
  // 路由规则
  path: '/social',
  name: 'social', // 为模块的一级路由添加name属性，做权限时用到
  component: Layout,
  children: [
    {
      // 二级路由路径为空时，表示二级路由的默认路由
      path: '',
      component: () => import('@/views/social'),
      // 路由元信息
      // 可以用来存放任何数据
      meta: {
        // 左侧导航栏会读取这里的属性
        title: '社保'
      }
    }
  ]
}
