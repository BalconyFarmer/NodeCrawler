/**
 * 用户接口
 */
const fs = require('fs')
const {initSequelize} = require("../../app.js")
const {sessionApp} = require("../../app.js")
const moveFile = require('../../common/utils/moveFile');
const koaBody = require('koa-body')
const path = require('path')
const getUploadFileExt = require('../../common/utils/getUploadFileExt');
const getUploadFileName = require('../../common/utils/getUploadFileName');
const checkDirExist = require('../../common/utils/checkDirExist');

const register = async ctx => {
    let postData = ctx.request.body

    const result = await initSequelize.handleRegist(postData)
    if (result === null) {
        ctx.body = '该账户已注册'
    } else {
        const folderAddress = `./static/uploadDefault/${result.id}`
        const folderAddressObj = `./static/uploadDefault/${result.id}/objs`
        const folderAddressPic = `./static/uploadDefault/${result.id}/pictures`
        const folderAddressvideo = `./static/uploadDefault/${result.id}/videos`
        const folderAddressScene = `./static/uploadDefault/${result.id}/scenes`
        const headIcon = `./static/uploadDefault/${result.id}/headIcon`
        fs.mkdirSync(folderAddress); // 创建用户文件夹
        fs.mkdirSync(folderAddressObj);
        fs.mkdirSync(folderAddressPic);
        fs.mkdirSync(folderAddressvideo);
        fs.mkdirSync(folderAddressScene);
        fs.mkdirSync(headIcon);
        ctx.body = '注册成功'
    }
}

const login = async ctx => {
    let postData = ctx.request.body
    const result = await initSequelize.handleLogin(postData)
    if (result) {
        if (result.password === postData.password) {
            sessionApp.setSession(ctx, result)
            ctx.body = result
        } else {
            ctx.body = '密码错误'
        }
    } else {
        ctx.body = '请先注册'
    }
}

const testSession = async ctx => {
    let postData = ctx.request.body
    const userid = sessionApp.judgeSession(ctx)
    ctx.body = "用户id:" + userid
}

const getUserById = async ctx => {
    let postData = ctx.request.body
    const params = postData.id
    const result = await initSequelize.getUserById(params)
    if (result) {
        ctx.body = result
    } else {
        ctx.body = '获取失败'
    }
}

const uploadHeadBefore = koaBody({
    multipart: true,
    formidable: {
        uploadDir: path.join(__dirname, './uploadDefault'),
        keepExtensions: true,
        maxFieldsSize: 2000 * 1024 * 1024,  // 1000 M
        onFileBegin: (name, file) => {
            console.log(name,file,"++++++++++++")
            // 获取文件后缀
            const ext = getUploadFileExt(file.name);
            const staticPath = '../../static'
            const dirName = name;
            const dir = path.join(__dirname, `${staticPath}/uploadDefault/${dirName}/headIcon`);
            checkDirExist(dir);
            const fileName = getUploadFileName(ext);

            // 真实写入路径
            file.path = `${dir}/${fileName}`;

            // 数据库存储路径
            const realPath = `/uploadDefault/${dirName}/headIcon/${fileName}`
            file.realPath = realPath
        },
        patchKoa: true
    }
})

const uploadHead = async ctx => {
    const userid = sessionApp.judgeSession(ctx)

    let files = null
    for (let i in ctx.request.files) {
        files = ctx.request.files[i]
    }

    const postData = {
        userid: userid,
        videoname: ctx.request.body.videoIntroduce,
        videopath: files.realPath
    }
    await initSequelize.uploadHead(postData)
    ctx.body = postData.videopath;

    ctx.body = "11"

}

module.exports = {
    register,
    login,
    getUserById,
    testSession,
    uploadHeadBefore,
    uploadHead,
};
