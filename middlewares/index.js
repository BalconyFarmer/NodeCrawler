const cors = require('@koa/cors')
const {config} = require('../common/config')
const koaBody = require('koa-body')
const static = require('koa-static')
const path = require('path')
const jwt = require("koa-jwt");


const CORS = cors({
    // 允许跨域地址(带cookie必须指定地址,不能为*)
    origin: config.corsAdress,
    // 是否允许发送cookie(前端相应设置 axios -> withCredentials: true)
    credentials: true,
    //指定本次预检请求的有效期，单位为秒。
    // maxAge: 15,
    //设置所允许的HTTP请求方法
    // allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    //设置服务器支持的所有头信息字段
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
    //设置获取其他自定义字段
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization']
})

// 通用POST接口解析body数据
const _koaBody = koaBody()

const _static = static(
    path.join(__dirname, '../static')
)

const initJWT = jwt({secret: config.JWTSecret, passthrough: true,debug: true}).unless({path: ["/gettoken"]})

module.exports = [
    CORS,
    _koaBody,
    _static,
    initJWT,
];
