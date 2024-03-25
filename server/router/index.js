// server/router.js
const router = require('koa-router')()
const user = require('./user')
const createFile = require('./createFile')
//创建路由规则
router.post('/', async (ctx, next) => {
  let postData = ctx.request.body
  ctx.body = postData
})
// 挂载 user 路由
router.use('/api/user', user.routes(), user.allowedMethods())
router.use('/api/createFile', createFile.routes(), createFile.allowedMethods())

module.exports = router
