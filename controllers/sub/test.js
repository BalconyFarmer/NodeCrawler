/**
 * 标准参考接口
 */

const koaBody = require('koa-body')
const path = require('path')
const getUploadFileExt = require('../../common/utils/getUploadFileExt');
const getUploadFileName = require('../../common/utils/getUploadFileName');
const checkDirExist = require('../../common/utils/checkDirExist');
const getUploadDirName = require('../../common/utils/getUploadDirName');

const TestPost = async ctx => {
    ctx.body = JSON.stringify(ctx.request.body);
}

const TestGet = async ctx => {
    let request = ctx.request;
    let req_query = request.query.name;
    ctx.body = req_query
}

const TestUploadOnlyBefore = koaBody({
    multipart: true,
    // encoding: 'gzip',
    formidable: {
        uploadDir: path.join(__dirname, './uploadDefault'),
        keepExtensions: true,
        maxFieldsSize: 2000 * 1024 * 1024,  // 1000 M
        onFileBegin: (name, file) => {
            console.log(name, file, "++++++++++++")

            // 获取文件后缀
            const ext = getUploadFileExt(file.name);

            // 最终要保存到的文件夹目录
            // const dirName = getUploadDirName();

            const staticPath = '../../static'
            const dirName = name;
            const dir = path.join(__dirname, `${staticPath}/uploadDefault/${dirName}`);

            // 检查文件夹是否存在如果不存在则新建文件夹
            // uploadDefault
            const uploadDefaultPath = path.join(__dirname, `${staticPath}/uploadDefault`)
            checkDirExist(uploadDefaultPath);
            checkDirExist(dir);

            // 获取文件名称
            const fileName = getUploadFileName(ext);

            // 重新覆盖 file.path 属性
            file.path = `${dir}/${fileName}`;

            // ???什么意思???
            // app.context.uploadpath = app.context.uploadpath ? app.context.uploadpath : {};
            // app.context.uploadpath[name] = `${dirName}/${fileName}`;
        },
        patchKoa: true
    }
})

const TestUploadOnly = async (ctx) => {
    const files = ctx.request.files
    const see = Object.keys(files)
    ctx.body = JSON.stringify(ctx.request.body);
}

module.exports = {
    TestPost,
    TestGet,
    TestUploadOnlyBefore,
    TestUploadOnly
};