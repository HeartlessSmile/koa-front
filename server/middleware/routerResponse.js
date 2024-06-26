function routerResponse(option = {}) {
  return async function (ctx, next) {
    ctx.success = function (data, msg) {
      ctx.type = option.type || 'json'
      ctx.body = {
        code: option.successCode || 200,
        msg: msg,
        data: data,
      }
    }

    ctx.fail = function (msg, code) {
      ctx.type = option.type || 'json'
      ctx.body = {
        code: code || option.failCode || 500,
        msg: msg || option.successMsg || 'fail',
      }
      console.log(ctx.body)
    }

    await next()
  }
}
module.exports = routerResponse
