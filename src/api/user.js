import request from '@/utils/request'

export function login(data) {
  // 返回一个axios对象 => promise
  // 等于返回了promise对象
  return request({
    url: '/sys/login', // 所有的接口都要跨域，都得带上/api
    method: 'POST',
    data
  })
}

/*
  获取用户资料
*/
export function getUserInfo() {
  return request({
    url: '/sys/profile',
    method: 'post'
  })
}

/*
  根据id获取用户详情
*/
export function getUserDetailById(id) {
  return request({
    url: `/sys/user/${id}`
  })
}

export function logout() {

}
