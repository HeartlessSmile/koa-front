import service from './http'

export const getUserList = () => {
  return service({
    url: '/api/user/list',
    method: 'get',
  })
}

export const getTest = (params) => {
  return service.get('/api/user/test', { params })
}

export const uploadFleApi = (params) => {
  return service.post('/api/user/uploadFile', params, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}
