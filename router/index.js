const Router = require('koa-router')
const router = new Router()
const {
    register,
    login,
    getUserById,
    uploadHead,
    saveVideo,
    saveBigImg,
    getVideoList,
    getMyProfile,
    getMyProfileVideo,
    delMyProfile,
    updateMyProfile,
    addAttention,
    delAttention,
    findAttention,
    findMyAttention,
    findMyFlowerAttention,
    videoContentAdd,
    videoContentQuery,
    gettoken,
    showInfo,
    testSession,
    TestPost,
    TestGet,
    TestUploadOnlyBefore,
    TestUploadOnly,
    uploadHeadBefore,
    saveVideoBefore,
    saveBigImgBefore,
    saveDailyBefore,
    saveDaily,
    findDaily
} = require('../controllers');

const routeList = [
    {
        method: 'post',
        path: '/testSession',
        controller: testSession
    },
    {
        method: 'post',
        path: '/gettoken',
        controller: gettoken
    },
    {
        method: 'post',
        path: '/showInfo',
        controller: showInfo
    },

    /**
     * 用户管理
     */
    {
        method: 'post',
        path: '/register',
        controller: register
    },
    {
        method: 'post',
        path: '/login',
        controller: login
    },
    {
        method: 'post',
        path: '/getUserById',
        controller: getUserById
    },
    {
        method: 'post',
        path: '/uploadHead',
        before: uploadHeadBefore,
        controller: uploadHead
    },
    /**
     * 文件上传
     */
    {
        method: 'post',
        path: '/saveVideo',
        before: saveVideoBefore,
        controller: saveVideo
    },
    {
        method: 'post',
        path: '/saveBigImg',
        before: saveBigImgBefore,
        controller: saveBigImg
    },
    {
        method: 'post',
        path: '/getVideoList',
        controller: getVideoList
    },
    {
        method: 'post',
        path: '/getMyProfile',
        controller: getMyProfile
    },
    {
        method: 'post',
        path: '/getMyProfileVideo',
        controller: getMyProfileVideo
    },
    {
        method: 'post',
        path: '/delMyProfile',
        controller: delMyProfile
    },

    {
        method: 'post',
        path: '/updateMyProfile',
        controller: updateMyProfile
    },
    {
        method: 'post',
        path: '/addAttention',
        controller: addAttention
    },
    {
        method: 'post',
        path: '/delAttention',
        controller: delAttention
    },
    {
        method: 'post',
        path: '/findAttention',
        controller: findAttention
    },
    {
        method: 'post',
        path: '/findMyAttention',
        controller: findMyAttention
    },
    {
        method: 'post',
        path: '/findMyFlowerAttention',
        controller: findMyFlowerAttention
    },
    {
        method: 'post',
        path: '/videoContentAdd',
        controller: videoContentAdd
    },
    {
        method: 'post',
        path: '/videoContentQuery',
        controller: videoContentQuery
    },
    {
        method: 'post',
        path: '/TestPost',
        controller: TestPost
    },
    {
        method: 'get',
        path: '/TestGet',
        controller: TestGet
    },
    {
        method: 'post',
        path: '/TestUploadOnly',
        before: TestUploadOnlyBefore,
        controller: TestUploadOnly
    },
    {
        method: 'post',
        path: '/saveDaily',
        before: saveDailyBefore,
        controller: saveDaily
    },
    {
        method: 'post',
        path: '/findDaily',
        controller: findDaily
    },
];

routeList.forEach(item => {
    if (item.before) { // 文件上传处理
        const {method, path, before, controller} = item;
        router[method](path, before, controller);
    } else {
        const {method, path, controller} = item;
        router[method](path, controller);
    }
});


module.exports = {router};
