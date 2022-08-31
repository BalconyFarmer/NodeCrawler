/**
 * 互相关注接口
 */
const {initSequelize} = require("../../app.js")

const addAttention = async ctx => {
    const result = await initSequelize.addAttention(ctx.request.body)
    if (result) {
        ctx.body = result
    } else {
        ctx.body = ''
    }
}

const delAttention = async ctx => {
    const result = await initSequelize.delAttention(ctx.request.body)
    if (result) {
        ctx.body = result
    } else {
        ctx.body = ''
    }
}

const findAttention = async ctx => {
    const result = await initSequelize.findAttention(ctx.request.body)
    if (result) {
        ctx.body = result
    } else {
        ctx.body = ''
    }
}

const findMyAttention = async ctx => {
    const result = await initSequelize.findMyAttention(ctx.request.body)
    if (result) {
        ctx.body = result
    } else {
        ctx.body = ''
    }
}

const findMyFlowerAttention = async ctx => {
    const result = await initSequelize.findMyFlowerAttention(ctx.request.body)
    if (result) {
        ctx.body = result
    } else {
        ctx.body = ''
    }
}

module.exports = {
    addAttention,
    delAttention,
    findAttention,
    findMyAttention,
    findMyFlowerAttention,
};
