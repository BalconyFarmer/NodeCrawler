const Koa = require('koa')
const app = new Koa()

module.exports = {app};

// 初始化 数据库
const {initSquelize} = require('./model/initSquelize')
let initSequelize = new initSquelize()

module.exports = {initSequelize};

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






