const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token, // 在根级的getters开放子模块
  name: state => state.user.userInfo.username, // 建立对用户名称的映射
  userId: state => state.user.userInfo.userId,
  staffPhoto: state => state.user.staffPhoto // 建立头像的映射
}
export default getters
