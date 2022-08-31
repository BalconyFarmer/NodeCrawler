const koaBody = require('koa-body')
const path = require('path')
const getUploadFileExt = require('../../common/utils/getUploadFileExt');
const getUploadFileName = require('../../common/utils/getUploadFileName');

const {initSequelize} = require("../../app.js")

const checkDirExist = require('../../common/utils/checkDirExist');

module.exports.saveDailyBefore = koaBody({
    multipart: true,
    formidable: {
        uploadDir: path.join(__dirname, './uploadDefault'),
        keepExtensions: true,
        maxFieldsSize: 2000 * 1024 * 1024,  // 1000 M
        onFileBegin: (name, file) => {
            // 获取文件后缀
            const ext = getUploadFileExt(file.name);
            const staticPath = '../../static'
            const dirName = name;
            const dir = path.join(__dirname, `${staticPath}/uploadDefault/${dirName}`);
            checkDirExist(dir);
            const fileName = getUploadFileName(ext);

            // 真实写入路径
            file.path = `${dir}/${fileName}`;

            // 数据库存储路径
            const realPath = `/uploadDefault/${dirName}/${fileName}`
            file.realPath = realPath
            file.userID = dirName
        },
        patchKoa: true
    }
})

module.exports.saveDaily = async ctx => {
    const files = ctx.request.files

    let id = null
    for (let i in files) {
        id = i
    }

    const postData = {
        userID: files[id].userID,
        content: ctx.request.body.videoIntroduce,
        path: files[id].realPath,
    }
    const result = await initSequelize.saveDaily(postData)

    ctx.body = result
}

module.exports.findDaily = async ctx => {
    const result = await initSequelize.findDaily()
    ctx.body = result
}