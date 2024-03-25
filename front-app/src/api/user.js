import service from './http'

export const getUserList = () => {
  return service({
    url: '/api/user/list',
    method: 'get',
  })
}
