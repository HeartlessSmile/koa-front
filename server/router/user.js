// server/router/user.js
const userRouter = require('koa-router')()

userRouter.post('/', (ctx, next) => {
  let postData = ctx.request.body
  ctx.body = postData
})
userRouter.get('/list', (ctx, next) => {
  let postData = ctx.request.body
  ctx.success({ name: 'smile', age: 20 }, '请求成功')
})

module.exports = userRouter
