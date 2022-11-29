import request from '@/utils/request'

/*
    获取组织架构数据
*/
export function getDepartments() {
  return request({
    url: '/company/department'
  })
}

/*
  删除组织架构的部门
*/
export function delDepartments(id) {
  return request({
    url: `/company/department/${id}`,
    /*
      接口满足restful规范
      同样的地址 不同的方法 执行不同的业务
      delete 删除业务
      get 获取业务
      post 新增/添加业务
      put修改业务
    */
    method: 'delete'
  })
}

/*
  新增部门
*/
export function addDepartments(data) {
  return request({
    url: '/company/department',
    method: 'post',
    data // axios的body参数 data
  })
}

/*
  获取某部门详情
*/
export function getDepartDetail(id) {
  return request({
    url: `/company/department/${id}`
  })
}

/*
  保存编辑的数据
*/
export function updateDepartments(data) {
  return request({
    url: `/company/department/${data.id}`,
    method: 'put',
    data
  })
}
