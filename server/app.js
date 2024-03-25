const Koa = require('koa')
const path = require('path')
const routers = require('./router/index.js')
const bodyParser = require('koa-bodyparser')
const static = require('koa-static')
const cors = require('@koa/cors')
const routerResponse =  require('./middleware/routerResponse')

const app = new Koa()

//跨域问题解决方面 
app.use(cors());


// 静态资源目录对于相对入口文件index.js的路径'
const staticPath = './static'
app.use(static(path.join(__dirname, staticPath)))

// 处理post请求
app.use(bodyParser())

// 添加统一返回格式
app.use(routerResponse());

// 注册路由
app.use(routers.routes()).use(routers.allowedMethods())



app.listen(3000, () => {
  console.log('服务器启动 http://127.0.0.1:3000')
})
