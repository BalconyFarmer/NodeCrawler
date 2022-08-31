const {initSequelize} = require("../../app.js")
const moveFile = require('../../common/utils/moveFile');
const {sessionApp} = require("../../app.js")
const fs = require('fs')
const koaBody = require('koa-body')
const path = require('path')
const getUploadFileExt = require('../../common/utils/getUploadFileExt');
const getUploadFileName = require('../../common/utils/getUploadFileName');
const checkDirExist = require('../../common/utils/checkDirExist');

const saveVideoBefore = koaBody({
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
            const dir = path.join(__dirname, `${staticPath}/uploadDefault/${dirName}/videos`);
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
// 保存视频
const saveVideo = async ctx => {
    const userid = sessionApp.judgeSession(ctx)
    const files = ctx.request.files

    let id = null
    for (let i in files) {
        id = i
    }
    const postData = {
        userid: id,
        videoname: ctx.request.body.videoIntroduce,
        videopath: ctx.request.files[id].realPath,
        type: "video"
    }
    await initSequelize.saveVideo(postData)

    ctx.body = postData;
}

const saveBigImgBefore = koaBody({
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
            const dir = path.join(__dirname, `${staticPath}/uploadDefault/${dirName}/pictures`);
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
const saveBigImg = async ctx => {
    // const userid = sessionApp.judgeSession(ctx)
    const files = ctx.request.files

    let id = null
    for (let i in files) {
        id = i
    }

    const postData = {
        userid: id,
        videoname: ctx.request.body.videoIntroduce,
        videopath: files[id].realPath
    }
    const result = await initSequelize.saveBigImg(postData)

    ctx.body = postData
}

const getVideoList = async ctx => {
    const result = await initSequelize.getVideoList(ctx.request.body.pageIndex)
    const allCount = await initSequelize.getVideoListLength()
    const res = {
        list: result,
        allCnt: allCount.count
    }
    if (result) {
        ctx.body = res
    } else {
        ctx.body = ''
    }

    // ctx.success( {id: '123'}, '创建成功', 201 )

}

const getMyProfile = async ctx => {
    let postData = ctx.request.body
    const result = await initSequelize.getMyProfile(postData.id)
    if (result) {
        ctx.body = result
    } else {
        ctx.body = null
    }
}

const getMyProfileVideo = async ctx => {
    let postData = ctx.request.body
    const result = await initSequelize.getMyProfileVideo(postData.id)
    if (result) {
        ctx.body = result
    } else {
        ctx.body = null
    }
}

const delMyProfile = async ctx => {
    // 判断文件是否存在再删除
    const deleteRecursive = (url) => {
        // 判断给定的路径是否存在
        if (fs.existsSync(url)) {
            fs.unlinkSync(url);
        } else {
            ctx.body = '给定的路径不存在，请给出正确的路径'
            console.log('给定的路径不存在，请给出正确的路径');
        }
    };

    let postData = ctx.request.body
    const dir = path.join(__dirname, "../../static" + postData.path);
    deleteRecursive(dir)

    const result = await initSequelize.delMyProfile(postData.id)

    if (result) {
        ctx.body = '删除成功!'
    } else {
        ctx.body = '删除失败!'
    }
}

const updateMyProfile = async ctx => {
    let postData = ctx.request.body
    const params = {
        msgid: postData.msgid,
        msg: postData.msg
    }
    const result = await initSequelize.updateMyProfile(params)
    if (result) {
        ctx.body = result
    } else {
        ctx.body = '获取失败'
    }
}


module.exports = {
    saveVideoBefore,
    saveVideo,
    saveBigImgBefore,
    saveBigImg,
    getVideoList,
    getMyProfile,
    getMyProfileVideo,
    delMyProfile,
    updateMyProfile
};
