const jsonwebtoken = require("jsonwebtoken");
const {config} = require('../../common/config')

let index = 1
/**
 * headers my-token tokenValue
 * @param ctx
 * @param next
 * @returns {Promise<void>}
 */
const gettoken = async (ctx, next) => {
    //模拟数据
    let user = {userId: index, name: index};
    index += 1
    //使用jsonwebtoken加密
    let token = jsonwebtoken.sign(user, config.JWTSecret);
    //响应token
    ctx.response.set('my-token', token);
    ctx.body = "token写回成功:" + token;
}

/**
 * 客户端访问http://localhost:8888/showInfo并在请求头上携带authorization:bearer tokenValue时，可获取用户数据
 * @param ctx
 * @param next
 * @returns {Promise<void>}
 */
const showInfo = async (ctx, next) => {
    //jwt中为了获取之前加密的数据,可以使用ctx.state.user来拿
    console.log(ctx.state.user, "+++")
    ctx.body = "登录成功:" + ctx.state.user.name
}

module.exports = {
    gettoken,
    showInfo
};
