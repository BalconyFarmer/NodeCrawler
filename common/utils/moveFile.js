/**
 * @description
 */
const path = require('path');
const fs = require('fs');

async function moveFile(userid,ctx,type) {
    const videoName = ctx.request.files['files[]'].name
    const beforePath = ctx.request.files['files[]'].path
    const afterPath = `./static/2userStatic/${userid}/${type}/${videoName}`

    const reader = fs.createReadStream(beforePath)
    const writer = fs.createWriteStream(afterPath)
    reader.pipe(writer) // 移动
    fs.unlink(beforePath, function (a) {}) // 删除暂存文件
    return afterPath
}

module.exports = moveFile;
