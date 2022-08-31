const session = require('koa-session-minimal')
const MysqlStore = require('koa-mysql-session')
const {config} = require('./config')

/**
 * 用户会话状态类
 */
class SessionApp {
    constructor(app) {
        this.app = app
        this.sessionConfig = {
            database: {
                USERNAME: config.USERNAME,
                PASSWORD: config.PASSWORD,
                DATABASE: config.DATABASE,
                HOST: config.sqlAdress
            }
        }
        this.init()
    }

    init() {
        // session存储配置
        const sessionMysqlConfig = {
            user: this.sessionConfig.database.USERNAME,
            password: this.sessionConfig.database.PASSWORD,
            database: this.sessionConfig.database.DATABASE,
            host: this.sessionConfig.database.HOST,
        }
        const minits = 50000 // 1分钟
        // 配置session中间件
        this.app.use(session({
            key: 'USER_SID_SESSION',
            store: new MysqlStore(sessionMysqlConfig),
            cookie: {                        // 与 cookie 相关的配置
                // domain: 'http://localhost:1111',    // 写 cookie 所在的域名 ??????
                domain: 'localhost',    // 写 cookie 所在的域名 ??????
                path: '/',                   // 写 cookie 所在的路径
                maxAge: minits * 60 * 1000,      // cookie/session 有效时长
                httpOnly: false,             // 是否只用于 http 请求中获取
                overwrite: true              // 是否允许重写
            }
        }))
    }

    // 登录成功后设置session到MySQL和设置sessionId到cookie
    setSession(ctx, result) {
        let session = ctx.session
        ctx.session.isLogin = true
        session.userName = result.name
        session.userId = result.id
        session.password = result.password
        session.headIcon = result.headIcon
    }

    // 判断session
    judgeSession(ctx) {
        if (ctx.session && ctx.session.isLogin && ctx.session.userName) {
            console.log('用户已登陆', ctx.session.userName, ctx.session.userId,ctx.session.headIcon,)
            return ctx.session.userId
        } else {
            // 没有登录态则跳转到错误页面
            console.log('用户未登录', ctx.session.userId)
            return null
        }
    }
}

module.exports = {SessionApp}
