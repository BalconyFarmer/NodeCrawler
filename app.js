const Koa = require('koa')
const app = new Koa()

module.exports = {app};

// 注册中间件 cors body通用解析 静态资源指定 jwt
const compose = require('koa-compose');
const MD = require('./middlewares/');
app.use(compose(MD));

// 初始化 session
const {SessionApp} = require('./common/session')
const sessionApp = new SessionApp(app)

// 初始化 数据库
const {initSquelize} = require('./model/initSquelize')
let initSequelize = new initSquelize()

module.exports = {sessionApp, initSequelize};

// 注入router
const {router} = require('./router');
app.use(router.routes()).use(router.allowedMethods());

const {getIpAddress} = require('./common/getIPv4')
const port = 8084
app.listen(port, () => {
    console.log('服务启动成功 port http://localhost:' + port)
    console.log('服务启动成功 port http://' + getIpAddress() + ":" + port)
})

app.on('error', err => {
    log.error('server error', err)
});

// 开始爬虫
const {startCrawler} = require("./crawler/app")
startCrawler()






