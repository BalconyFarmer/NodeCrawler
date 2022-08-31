const {initSequelize} = require("../../app.js")

const videoContentAdd = async ctx => {
    const result = await initSequelize.videoContentAdd(ctx.request.body)
    if (result) {
        ctx.body = result
    } else {
        ctx.body = ''
    }
}

const videoContentQuery = async ctx => {
    const result = await initSequelize.videoContentQuery(ctx.request.body)
    if (result) {
        ctx.body = result
    } else {
        ctx.body = ''
    }
}


module.exports = {
    videoContentAdd,
    videoContentQuery,
};
