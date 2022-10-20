import { getToken, setToken, removeToken } from '@/utils/auth'
import { login, getUserInfo } from '@/api/user'

/*
  状态
  初始化时从缓存中读取状态
  并赋值到初始化的状态上

  Vuex的持久化如何实现？
  vuex与前端缓存相结合
*/
const state = {
  token: getToken(), // 设置token初始状态 token初始化 => 放入缓存中
  userInfo: {}
}

// 修改状态
const mutations = {
  // 设置token
  setToken(state, token) {
    state.token = token // 设置token只是修改state的数据
    // vuex变化 => 缓存数据
    setToken(state) // vuex和缓存数据同步
  },

  // 删除缓存
  removeToken(state) {
    state.token = null // 删除vuex的token
    removeToken() // 先清除vuex，再清除vuex和缓存数据的同步
  },

  setUserInfo(state, result) {
    // 更新一个对象
    state.userInfo = result // 这样是响应式
    // state.userInfo = { ...result } // 这样也是响应式 属于浅拷贝
    // state.userInfo['username'] = result // 这不是响应式
  },

  // 删除用户信息
  removeUserInfo(state) {
    state.userInfo = {}
  }
}

// 执行异步
const actions = {
  // 定义login action, 需要调用action时传递过来的参数
  async login(context, data) {
    // 实际上就是一个promise
    // result就是执行的结果
    const result = await login(data)
    // axios默认给数据加了一层data
    // if (result.data.success) {
    //   // 表示调用登录接口成功
    //   // actions修改state，必须通过mutations
    //   context.commit('setToken', result.data.data)
    // }
    context.commit('setToken', result)
  },
  async getUserInfo(context) {
    const result = await getUserInfo()
    context.commit('setUserInfo', result)

    return result // 这里为什么要返回，给后期做权限留下伏笔
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
