// server/router/user.js
const path = require('path')
const fs = require('fs')
const nunjucks = require('nunjucks')
const utilsBase = require('../utils/base')

const Router = require('koa-router')()
Router.post('/', (ctx, next) => {
  let bodyData = ctx.request.body
  const fileName = utilsBase.toHump(bodyData.name)
  const pathObject = {
    declare: {
      path: './declare-page/src',
      filePath: 'components/declare',
      api: 'api',
    },
    'declare-back': {
      path: './declare-page/src',
      filePath: 'components/declare-back',
      api: 'api/declare-back',
    },
    'tax-file': {
      path: './declare-page/src',
      filePath: 'components/tax-file',
      api: 'api/tax-file',
    },
    'taxes-calculation': {
      path: './taxes-calculation/src',
      filePath: 'components/views',
      api: 'api',
      isNew: true,
    },
  }

  const item = pathObject[bodyData.project]

  const USER_HOME = process.env.HOME || process.env.USERPROFILE
  const projectSrc = path.join(USER_HOME, './Desktop/szyh', item.path)

  // 确定创建文件夹的位置
  const filePath = path.join(projectSrc, item.filePath, fileName)
  const templateRoot = path.resolve(__dirname, '../template')
  nunjucks.configure(templateRoot, { autoescape: true })
  let hasDir = fs.existsSync(filePath)
  if (hasDir && !utilsBase.isDirectoryEmpty(filePath)) {
    ctx.fail('文件夹已存在', 500)
  } else {
    // 创建文件夹
    if (!hasDir) {
      fs.mkdirSync(filePath)
    }
    // 创建API
    if (bodyData.hasApi) {
      const apiPath = path.join(projectSrc, item.api)
      let apiName = fileName + 'Api'

      let str = nunjucks.render('apiTemplate.js')
      fs.writeFileSync(path.join(apiPath, apiName + '.js'), str, 'utf-8')

      let apiIndexPath = path.join(apiPath, 'index.js')

      let apiIndexContent = fs.readFileSync(apiIndexPath, 'utf-8')

      if (!apiIndexContent.includes(apiName)) {
        let exportIndex = apiIndexContent.indexOf('export')
        apiIndexContent =
          apiIndexContent.slice(0, exportIndex) +
          `import ${apiName} from "./${apiName}.js";\n` +
          apiIndexContent.slice(exportIndex)

        let exportIndex2 = apiIndexContent.indexOf('export default {') + 16
        apiIndexContent =
          apiIndexContent.slice(0, exportIndex2) + `\n\t${apiName},` + apiIndexContent.slice(exportIndex2)
        fs.writeFileSync(apiIndexPath, apiIndexContent, 'utf-8')
      }
    }
    if (bodyData.type == 'pageList') {
      // 创建index.vue + 内容
      let templatePath = item.isNew || bodyData.isNew ? 'newpageList.vue' : 'pageList.vue'

      let str = nunjucks.render(templatePath, {
        fileName,
        ...bodyData,
        selectSearchList: bodyData.searchTableData.filter((el) => el.type == 'select'),
        multipleSearchList: bodyData.searchTableData.filter((el) => el.type == 'select' && el.multiple),
      })
      fs.writeFileSync(path.join(filePath, 'index.vue'), str, 'utf-8')

      // 如果是新表格  顺便创建一个编辑抽屉和详情抽屉
      if (item.isNew || bodyData.isNew) {
        let hasDir = fs.existsSync(filePath + '/components')
        if (!hasDir) {
          fs.mkdirSync(filePath + '/components')
        }
        let editDrawerStr = nunjucks.render('editDrawer.vue', {})
        fs.writeFileSync(path.join(filePath, 'components', 'editDrawer.vue'), editDrawerStr, 'utf-8')
        let detailDrawerStr = nunjucks.render('detailDrawer.vue', {})
        fs.writeFileSync(path.join(filePath, 'components', 'detailDrawer.vue'), detailDrawerStr, 'utf-8')
      }
    } else {
      console.log(bodyData.type)
      const { tabs } = bodyData

      // 创建index.vue

      let indexStr = nunjucks.render('tabsTemplate.vue', {
        fileName,
        ...bodyData,
      })

      fs.writeFileSync(path.join(filePath, 'index.vue'), indexStr, 'utf-8')

      for (let i = 0; i < tabs.length; i++) {
        let tab = tabs[i]
        let tabPath = path.join(filePath, tab.value)
        fs.mkdirSync(tabPath)
      }
    }
    ctx.success({ name: 'smile', age: 20 }, '请求成功')
  }
})

module.exports = Router
