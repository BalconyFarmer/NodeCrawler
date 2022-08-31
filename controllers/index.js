const {
    saveVideoBefore,
    saveVideo,
    saveBigImg,
    getVideoList,
    getMyProfile,
    getMyProfileVideo,
    delMyProfile,
    updateMyProfile,
    saveBigImgBefore
} = require("./sub/uploadFile")

const {
    register,
    login,
    getUserById,
    uploadHeadBefore,
    uploadHead,
    testSession
} = require("./sub/normalusers")

const {
    addAttention,
    delAttention,
    findAttention,
    findMyAttention,
    findMyFlowerAttention,
} = require("./sub/attentions")

const {
    videoContentAdd,
    videoContentQuery,
} = require("./sub/videoContents")

const {
    gettoken,
    showInfo,
} = require("./sub/jwt")

const {
    TestPost,
    TestGet,
    TestUploadOnlyBefore,
    TestUploadOnly
} = require("./sub/test")

const {
    saveDailyBefore,
    saveDaily,
    findDaily
} = require("./fish/main")

module.exports = {
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
};

