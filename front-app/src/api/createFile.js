import service from './http'

export const create = (data) => {
  return service({
    url: '/api/createFile',
    method: 'post',
    data,
  })
}
