const {Sequelize, Model, DataTypes} = require('sequelize')
const {config} = require('../common/config')

/**
 * 数据库操作类
 */
class initSquelize {
    constructor() {
        this.UserModel = null
        this.a = this.init()
    }

    async init() {
        // 链接数据库
        const sequelize = new Sequelize(config.DATABASE, config.USERNAME, config.PASSWORD, {
            host: config.sqlAdress,
            dialect: 'mysql',
            timezone: '+08:00', // 输入正确时间
            dialectOptions: {   // 输出正确时间
                charset: 'utf8mb4',
                dateStrings: true,
                typeCast: true
            },
        });

        try {
            await sequelize.authenticate();
            console.log('数据库连接成功');
        } catch (error) {
            console.error('数据库链接失败!!!!:', error);
            await sequelize.authenticate();

        }

        // 定义用户模型
        this.UserModel = sequelize.define('normalusers', {
            id: {
                type: DataTypes.INTEGER(),
                autoIncrement: true,
                primaryKey: true,
            },
            name: DataTypes.STRING,
            password: DataTypes.STRING,
            headIcon: DataTypes.STRING
        }, {
            timestamps: false // 开启/关闭事件戳
        })

        // 视频
        this.VideoModel = sequelize.define('videos', {
            videoid: {
                type: DataTypes.INTEGER(),
                autoIncrement: true,
                primaryKey: true,
            },
            userid: DataTypes.INTEGER(),
            videoname: DataTypes.STRING,
            videopath: DataTypes.STRING,
            type: DataTypes.STRING
        }, {
            timestamps: true // 开启/关闭事件戳
        })

        // 评论
        this.videoContent = sequelize.define('videoContents', {
            contentid: {
                type: DataTypes.INTEGER(),
                autoIncrement: true,
                primaryKey: true,
            },
            projectId: DataTypes.INTEGER(),
            userId: DataTypes.INTEGER(),
            content: DataTypes.STRING,
            userName: DataTypes.STRING,
            headIcon: DataTypes.STRING,
        }, {
            timestamps: true // 开启/关闭事件戳
        })

        // 关注
        this.attention = sequelize.define('attention', {
            attentionid: {
                type: DataTypes.INTEGER(),
                autoIncrement: true,
                primaryKey: true,
            },
            from: DataTypes.INTEGER(),
            to: DataTypes.INTEGER(),
        }, {
            timestamps: true // 开启/关闭事件戳
        })

        // 鱼
        this.fish = sequelize.define('fish', {
            id: {
                type: DataTypes.INTEGER(),
                autoIncrement: true,
                primaryKey: true,
            },
            userID: DataTypes.INTEGER(),
            content: DataTypes.STRING(),
            path: DataTypes.STRING(),
        }, {
            timestamps: true // 开启/关闭事件戳
        })

        // 爬虫表
        this.CMFcrawler = sequelize.define('CMFcrawlers', {
            id: {
                type: DataTypes.INTEGER(),
                autoIncrement: true,
                primaryKey: true,
            },
            contents: DataTypes.STRING(),
            onlineNumber: DataTypes.INTEGER(),
            time: DataTypes.STRING(),
            href: DataTypes.STRING(),
            type: DataTypes.STRING(),
            indexTime: DataTypes.INTEGER(),
        }, {
            timestamps: false // 开启/关闭事件戳
        })

    }

    // 添加爬虫
    async saveCrawler(postData) {
        const result = await this.CMFcrawler.create({
            contents: postData.contents,
            onlineNumber: postData.onlineNumber,
            time: postData.time,
            href: postData.href,
            type: postData.type,
            indexTime: postData.indexTime,
        })
        return result
    }

    async findCrawler(postData) {
        const result = await this.CMFcrawler.findAll({
            where: {
                time: postData.time
            }
        })
        return result
    }



    // 添加鱼照片
    async saveDaily(postData) {
        const result = await this.fish.create({
            userID: postData.userID,
            content: postData.content,
            path: postData.path,
        })
        return result
    }

    async findDaily() {
        const result = await this.fish.findAll(
            {
                'order': [['timestamp', 'DESC']]
            }
        )
        return result
    }

    // 增
    async videoContentAdd(postData) {
        const result = await this.videoContent.create({
            projectId: postData.projectId,
            userId: postData.userId,
            content: postData.content,
            userName: postData.userName,
            headIcon: postData.headIcon,
        })
        return result
    }

    async videoContentQuery(postData) {
        const result = await this.videoContent.findAll({
            where: {
                projectId: postData.projectId
            }
        })
        return result
    }

    async handleRegist(postData) {
        let result = await this.handleLogin(postData)
        if (result) {
            return null
        } else {
            const result = await this.UserModel.create({
                name: postData.name,
                password: postData.password,
                headIcon: './static/2userStatic/defaultPortrait.png'
            })
            return result
        }
    }

    async handleLogin(postData) {
        const self = this
        const result = await this.UserModel.findAll({
            where: {
                name: postData.name
            }
        })
        if (result[0]) {
            return result[0].dataValues
        } else {
            return
        }
    }

    async getUserById(postData) {
        const self = this
        const result = await this.UserModel.findAll({
            where: {
                id: postData
            }
        })
        if (result[0]) {
            return result[0].dataValues
        } else {
            return
        }
    }

    async getMyProfile(userId) {
        const result = await this.VideoModel.findAll({
            where: {
                userid: userId,
                type: "img"
            }
        })
        if (result[0]) {
            return result
        } else {
            return
        }
    }

    async getMyProfileVideo(userId) {
        const result = await this.VideoModel.findAll({
            where: {
                userid: userId,
                type: "video"
            }
        })
        if (result[0]) {
            return result
        } else {
            return
        }
    }

    async delMyProfile(msID) {

        const result = await this.VideoModel.destroy({
            where: {
                videoid: msID
            }
        })
        return result
    }


    async updateMyProfile(params) {

        const result = await this.VideoModel.update(
            {
                'videoname': params.msg
            },
            {
                'where': {'videoid': params.msgid}
            })
        return result
    }


    async getAllWeibo() {
        const result = await this.VideoModel.findAll(
            {
                'order': [['timestamp', 'DESC']]
            }
        )
        return result
    }

    async saveVideo(postData) {
        const result = await this.VideoModel.create({
            userid: postData.userid,
            videoname: postData.videoname,
            videopath: postData.videopath,
            type: postData.type
        })
        return result
    }

    async saveBigImg(postData) {
        const result = await this.VideoModel.create({
            userid: postData.userid,
            videoname: postData.videoname,
            videopath: postData.videopath,
            type: "img"
        })
        return result
    }

    async getVideoList(pageIndex) {
        const result = await this.VideoModel.findAll(
            {
                'order': [['timestamp', 'DESC']],
                limit: 3,
                offset: pageIndex
            }
        )
        return result
    }

    async getVideoListLength() {
        const result = await this.VideoModel.findAndCountAll(
            {
                'order': [['timestamp', 'DESC']],
            }
        )
        return result
    }

    // 改
    async uploadHead(params) {

        const result = await this.UserModel.update(
            {
                'headIcon': params.videopath
            },
            {
                'where': {'id': params.userid}
            })
        return result
    }


    async addAttention(params) {
        const result = await this.attention.create(
            {
                'from': params.from,
                'to': params.to
            })
        return result
    }

    // 删
    async delAttention(params) {
        const result = await this.attention.destroy(
            {
                where: {
                    'from': params.from,
                    'to': params.to
                }
            })
        return result
    }


    // 查
    async findAttention(params) {
        const result = await this.attention.findAll(
            {
                where: {
                    'from': params.from,
                    'to': params.to
                }
            }
        )
        return result
    }

    /**
     * 获取我关注的人的列表
     * @param params
     * @returns {Promise<*>}
     */
    async findMyAttention(params) {
        const result = await this.attention.findAll(
            {
                where: {
                    'from': params.from,
                }
            }
        )
        return result
    }

    /**
     * 获取我的flowers列表
     * @param params
     * @returns {Promise<*>}
     */
    async findMyFlowerAttention(params) {
        const result = await this.attention.findAll(
            {
                where: {
                    'to': params.to
                }
            }
        )
        return result
    }

}

module.exports = {initSquelize}

